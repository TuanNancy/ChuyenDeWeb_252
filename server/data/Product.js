// Product DB helpers — dùng mongodb driver thuần (không Mongoose)
const { getCollection } = require("./connection");

const COLLECTION = "gears";

async function getAll() {
  const col = getCollection(COLLECTION);
  return col.find({}).toArray();
}

async function getById(id) {
  const col = getCollection(COLLECTION);
  return col.findOne({ id });
}

async function create(product) {
  const col = getCollection(COLLECTION);
  const result = await col.insertOne(product);
  return result;
}

async function updateById(id, updates) {
  const col = getCollection(COLLECTION);
  const result = await col.updateOne({ id }, { $set: updates });
  return result;
}

async function deleteById(id) {
  const col = getCollection(COLLECTION);
  const result = await col.deleteOne({ id });
  return result;
}

async function search(keyword) {
  const col = getCollection(COLLECTION);
  const regex = { $regex: keyword, $options: "i" };
  const query = {
    $or: [
      { name: regex },
      { id: regex },
      { description: regex },
      { tags: regex },
      { "specifications.heightRange": regex },
      { "specifications.chieucao": regex },
      { chieucao: regex },
    ],
  };
  return col.find(query).toArray();
}

async function adminSearch(keyword) {
  const col = getCollection(COLLECTION);
  const regex = new RegExp(`^${keyword}`, 'i');
  return col.find({ id: regex }).toArray();
}

/**
 * Import nhiều sản phẩm từ mảng dữ liệu
 * @param {Array} products - Mảng sản phẩm cần import
 * @param {Object} options - { overrideOnDuplicate: boolean }
 * @returns {Object} { success: number, skipped: number, errors: Array }
 */
async function importProducts(products, options = { overrideOnDuplicate: true }) {
  const col = getCollection(COLLECTION);
  const result = { success: 0, skipped: 0, errors: [] };

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const rowNumber = i + 1;

    // Validation cơ bản: bắt buộc có id, name, price
    if (!product.id || !product.name || product.price == null) {
      result.errors.push({
        row: rowNumber,
        error: `Thiếu trường bắt buộc (id, name, price)`,
        data: product,
      });
      result.skipped++;
      continue;
    }

    // Chuyển đổi price sang số
    const price = Number(product.price);
    if (isNaN(price) || price < 0) {
      result.errors.push({
        row: rowNumber,
        error: `Giá không hợp lệ: ${product.price}`,
        data: product,
      });
      result.skipped++;
      continue;
    }

    // Chuẩn hóa dữ liệu
    const normalizedProduct = {
      id: String(product.id).trim(),
      name: String(product.name).trim(),
      price: price,
      description: product.description ? String(product.description).trim() : "",
      stock: product.stock ? Number(product.stock) : 0,
      warranty: product.warranty ? String(product.warranty).trim() : null,
      tags: product.tags
        ? String(product.tags)
            .split(/[,;]/)
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      specifications: product.specifications || {},
      images: product.images || "",
    };

    // Xử lý specifications nếu có các trường riêng
    // (các cột như "driver", "dpi", "screenSize" sẽ được gom vào specifications)
    const specFields = [
      "driver",
      "frequency",
      "connectivity",
      "dpi",
      "battery",
      "screenSize",
      "refreshRate",
      "resolution",
      "panelType",
      "weight",
      "dimensions",
      "material",
      "weightCapacity",
      "adjustableHeight",
      "armrests",
      "wheels",
      "foldable",
      "color",
      "compatibility",
      "microphone",
      "noiseCancellation",
      "sensor",
      "printTechnology",
      "printSpeed",
      "functions",
      "paperSize",
      "projectionTechnology",
      "lumens",
      "throwRatio",
      "network",
    ];

    const specs = {};
    for (const field of specFields) {
      if (product[field] !== undefined && product[field] !== "") {
        specs[field] = String(product[field]).trim();
      }
    }
    if (Object.keys(specs).length > 0) {
      normalizedProduct.specifications = {
        ...normalizedProduct.specifications,
        ...specs,
      };
    }

    try {
      // Kiểm tra xem ID đã tồn tại chưa
      const existing = await col.findOne({ id: normalizedProduct.id });

      if (existing) {
        if (options.overrideOnDuplicate) {
          // Cập nhật sản phẩm hiện có
          await col.updateOne(
            { id: normalizedProduct.id },
            { $set: normalizedProduct }
          );
          result.success++;
        } else {
          // Bỏ qua nếu không override
          result.skipped++;
        }
      } else {
        // Thêm mới
        await col.insertOne(normalizedProduct);
        result.success++;
      }
    } catch (err) {
      result.errors.push({
        row: rowNumber,
        error: `Lỗi khi import: ${err.message}`,
        data: product,
      });
      result.skipped++;
    }
  }

  return result;
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  search,
  adminSearch,
  importProducts,
};
