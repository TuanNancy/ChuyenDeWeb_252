import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../api";

/**
 * AdminProductForm — Form thêm mới hoặc chỉnh sửa sản phẩm
 * Dùng chung cho cả route /admin/add và /admin/edit/:id
 */
function AdminProductForm() {
  const { id } = useParams(); // id nếu là edit, undefined nếu là add
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    stock: 0,
    warranty: "",
    tags: "",
    images: "",
    specKeys: [""],
    specValues: [""],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  // Nếu là edit → load data
  useEffect(() => {
    if (!isEdit) return;
    setFetchLoading(true);
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        return res.json();
      })
      .then((data) => {
        const specEntries = data.specifications
          ? Object.entries(data.specifications)
          : [];
        setForm({
          id: data.id || "",
          name: data.name || "",
          price: data.price !== undefined ? data.price : "",
          description: data.description || "",
          stock: data.stock ?? 0,
          warranty: data.warranty || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          images: data.images || "",
          specKeys: specEntries.length ? specEntries.map(([k]) => k) : [""],
          specValues: specEntries.length
            ? specEntries.map(([, v]) => String(v))
            : [""],
        });
        setFetchLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setFetchLoading(false);
      });
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecKeyChange = (index, value) => {
    setForm((prev) => {
      const keys = [...prev.specKeys];
      keys[index] = value;
      return { ...prev, specKeys: keys };
    });
  };

  const handleSpecValueChange = (index, value) => {
    setForm((prev) => {
      const values = [...prev.specValues];
      values[index] = value;
      return { ...prev, specValues: values };
    });
  };

  const addSpecRow = () => {
    setForm((prev) => ({
      ...prev,
      specKeys: [...prev.specKeys, ""],
      specValues: [...prev.specValues, ""],
    }));
  };

  const removeSpecRow = (index) => {
    if (form.specKeys.length <= 1) return;
    setForm((prev) => {
      const keys = prev.specKeys.filter((_, i) => i !== index);
      const values = prev.specValues.filter((_, i) => i !== index);
      return { ...prev, specKeys: keys, specValues: values };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Build specifications object
    const specifications = {};
    form.specKeys.forEach((key, i) => {
      const k = key.trim();
      const v = form.specValues[i]?.trim();
      if (k && v) specifications[k] = v;
    });

    const body = {
      id: form.id.trim(),
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      stock: Number(form.stock),
      warranty: form.warranty.trim() || null,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      images: form.images.trim(),
      specifications,
    };

    if (!body.id || !body.name || isNaN(body.price)) {
      setError("Vui lòng điền đầy đủ Mã SP, Tên và Giá hợp lệ.");
      setLoading(false);
      return;
    }

    try {
      let url, method;
      if (isEdit) {
        url = `${API_BASE}/admin/products/${id}`;
        method = "PUT";
        // Khi edit, không gửi id trong body
        delete body.id;
      } else {
        url = `${API_BASE}/admin/products`;
        method = "POST";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Thao tác thất bại");
      }

      alert(isEdit ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading)
    return (
      <div className="page">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  if (error && !form.name)
    return (
      <div className="page">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );

  return (
    <div className="page admin-form-page">
      <Link to="/admin" className="back-link">
        &larr; Quay lại danh sách
      </Link>
      <h2 className="page-title">
        {isEdit ? `Chỉnh sửa: ${form.name}` : "Thêm sản phẩm mới"}
      </h2>

      {error && <p className="admin-error">{error}</p>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mã SP {!isEdit && <span className="required">*</span>}</label>
          <input
            name="id"
            value={form.id}
            onChange={handleChange}
            disabled={isEdit}
            required={!isEdit}
            placeholder="VD: balo180422"
          />
        </div>

        <div className="form-group">
          <label>
            Tên sản phẩm <span className="required">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Tên sản phẩm"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              Giá (VNĐ) <span className="required">*</span>
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
              min={0}
              placeholder="850000"
            />
          </div>
          <div className="form-group">
            <label>Tồn kho</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              min={0}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Bảo hành</label>
          <input
            name="warranty"
            value={form.warranty}
            onChange={handleChange}
            placeholder="VD: 12 tháng, hoặc để trống"
          />
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Mô tả sản phẩm..."
          />
        </div>

        <div className="form-group">
          <label>Tags (phân cách bằng dấu phẩy)</label>
          <input
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="du lịch, chống nước, unisex"
          />
        </div>

        <div className="form-group">
          <label>Đường dẫn ảnh</label>
          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="images/balo180422.jpg"
          />
        </div>

        <div className="form-group">
          <label>Thông số kỹ thuật</label>
          {form.specKeys.map((key, i) => (
            <div key={i} className="spec-row">
              <input
                placeholder="Tên thông số"
                value={key}
                onChange={(e) => handleSpecKeyChange(i, e.target.value)}
              />
              <input
                placeholder="Giá trị"
                value={form.specValues[i]}
                onChange={(e) => handleSpecValueChange(i, e.target.value)}
              />
              {form.specKeys.length > 1 && (
                <button
                  type="button"
                  className="admin-btn admin-btn-sm admin-btn-danger"
                  onClick={() => removeSpecRow(i)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="admin-btn admin-btn-secondary admin-btn-sm"
            onClick={addSpecRow}
          >
            + Thêm thông số
          </button>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : isEdit ? "Cập nhật" : "Thêm sản phẩm"}
          </button>
          <Link to="/admin" className="admin-btn admin-btn-secondary">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
