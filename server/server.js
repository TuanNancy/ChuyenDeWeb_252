const express = require("express");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
const csvParser = require("csv-parser");
const fs = require("fs");
const app = express();
const cors = require("cors");
const { getDb, closeDb } = require("./data/connection");
const Product = require("./data/Product");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ==================== MULTER UPLOAD ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "public", "images");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, unique);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file: jpg, jpeg, png, gif, webp"));
    }
  },
});

// Multer riêng cho import CSV/Excel (không filter, chỉ giới hạn size 10MB)
const uploadImport = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  // Không có fileFilter - sẽ validate sau khi upload
});

// ==================== PUBLIC ENDPOINTS ====================

app.get("/products", async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error("Lỗi GET /products:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách sản phẩm" });
  }
});

app.get("/products/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      const all = await Product.getAll();
      return res.json(all);
    }
    const results = await Product.search(q.trim());
    res.json(results);
  } catch (err) {
    console.error("Lỗi GET /products/search:", err.message);
    res.status(500).json({ error: "Lỗi server khi tìm kiếm" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    console.error("Lỗi GET /products/:id:", err.message);
    res.status(500).json({ error: "Lỗi server khi lấy sản phẩm" });
  }
});

// ==================== ADMIN ENDPOINTS ====================

// Upload ảnh
app.post(
  "/admin/upload",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      next();
    });
  },
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Chưa chọn file ảnh" });
    res.json({ imagePath: `images/${req.file.filename}` });
  },
);

app.get("/admin/products/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      const all = await Product.getAll();
      return res.json(all);
    }
    const results = await Product.adminSearch(q.trim());
    res.json(results);
  } catch (err) {
    console.error("Lỗi GET /admin/products/search:", err.message);
    res.status(500).json({ error: "Lỗi server khi tìm kiếm" });
  }
});

app.post("/admin/products", async (req, res) => {
  try {
    const product = req.body;
    if (!product.id || !product.name || typeof product.price !== "number") {
      return res
        .status(400)
        .json({ error: "Thiếu id, name hoặc price không hợp lệ" });
    }
    const existing = await Product.getById(product.id);
    if (existing)
      return res.status(409).json({ error: "Product ID đã tồn tại" });
    const result = await Product.create(product);
    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error("Lỗi POST /admin/products:", err.message);
    res.status(500).json({ error: "Lỗi server khi thêm sản phẩm" });
  }
});

app.put("/admin/products/:id", async (req, res) => {
  try {
    const updates = req.body;
    const result = await Product.updateById(req.params.id, updates);
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi PUT /admin/products/:id:", err.message);
    res.status(500).json({ error: "Lỗi server khi cập nhật" });
  }
});

app.delete("/admin/products/:id", async (req, res) => {
  try {
    const result = await Product.deleteById(req.params.id);
    if (result.deletedCount === 0)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    console.error("Lỗi DELETE /admin/products/:id:", err.message);
    res.status(500).json({ error: "Lỗi server khi xóa" });
  }
});

// Import CSV/Excel
app.post(
  "/admin/import",
  (req, res, next) => {
    uploadImport.single("file")(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: "Chưa chọn file" });
      next();
    });
  },
  async (req, res) => {
    try {
      const filePath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      let products = [];

      if (ext === ".csv") {
        // Parse CSV
        products = await new Promise((resolve, reject) => {
          const results = [];
          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => results.push(row))
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
        });
      } else if ([".xlsx", ".xls"].includes(ext)) {
        // Parse Excel
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        products = xlsx.utils.sheet_to_json(sheet, { defval: "" });
      } else {
        return res.status(400).json({
          error: "Định dạng file không được hỗ trợ. Chỉ chấp nhận CSV, XLSX, XLS",
        });
      }

      // Xóa file tạm sau khi parse
      fs.unlinkSync(filePath);

      if (products.length === 0) {
        return res
          .status(400)
          .json({ error: "File không có dữ liệu hoặc dòng nào hợp lệ" });
      }

      // Import vào database
      const override = req.query.override !== "false"; // mặc định override
      const result = await Product.importProducts(products, {
        overrideOnDuplicate: override,
      });

      res.json({
        message: "Import hoàn tất",
        totalRows: products.length,
        success: result.success,
        skipped: result.skipped,
        errors: result.errors.length > 0 ? result.errors.slice(0, 10) : [], // tối đa 10 lỗi
      });
    } catch (err) {
      console.error("Lỗi POST /admin/import:", err.message);
      res.status(500).json({ error: "Lỗi server khi import dữ liệu" });
    }
  }
);

app.get("/", (req, res) => res.send("Hello World! from server"));

async function start() {
  try {
    await getDb();
  } catch (err) {
    console.error("[start] Không thể kết nối DB:", err.message);
  }
  app.listen(5000, () => console.log("Server is running on port 5000"));
}
start();

process.on("SIGINT", async () => {
  await closeDb();
  process.exit(0);
});
