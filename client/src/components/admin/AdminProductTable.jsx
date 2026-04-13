import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../api";

/**
 * AdminProductTable — Bảng quản lý sản phẩm với search box riêng
 * Hiển thị 3 cột chính: name, price, warranty
 * Có nút Thêm / Sửa / Xóa
 */
function AdminProductTable() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async (q = "") => {
    setLoading(true);
    try {
      let url;
      if (q.trim()) {
        url = `${API_BASE}/admin/products/search?q=${encodeURIComponent(q.trim())}`;
      } else {
        url = `${API_BASE}/products`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải danh sách");
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${id}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Xóa thất bại");
      }
      loadProducts(search);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-product-table">
      <div className="admin-toolbar">
        <form className="admin-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm kiếm theo tên, mô tả, bảo hành, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="admin-btn admin-btn-primary">
            Tìm
          </button>
          {search && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => {
                setSearch("");
                loadProducts("");
              }}
            >
              Xóa bộ lọc
            </button>
          )}
        </form>
        <Link to="/admin/add" className="admin-btn admin-btn-success">
          + Thêm sản phẩm
        </Link>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>Lỗi: {error}</p>}

      {!loading && !error && (
        <>
          <p className="admin-count">Tìm thấy {products.length} sản phẩm</p>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Bảo hành</th>
                  <th>Tồn kho</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="admin-code">{p.id}</td>
                    <td>
                      <Link
                        to={`/products/p/${p.id}`}
                        className="admin-product-link"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="admin-price">
                      {typeof p.price === "number"
                        ? `${p.price.toLocaleString("vi-VN")} đ`
                        : p.price}
                    </td>
                    <td>{p.warranty || "—"}</td>
                    <td>{p.stock ?? 0}</td>
                    <td className="admin-actions">
                      <Link
                        to={`/admin/edit/${p.id}`}
                        className="admin-btn admin-btn-sm admin-btn-warning"
                      >
                        Sửa
                      </Link>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminProductTable;
