import React, {
  useEffect,
  useState,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../api";

function AdminProductTable() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async (q = "") => {
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
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  return (
    <div className="admin-product-table">
      <div className="admin-toolbar">
        <form className="admin-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Tìm theo mã sản phẩm (ID)..."
            value={search}
            onChange={handleSearchChange}
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
                      <Link
                        to={`/admin/delete/${p.id}`}
                        className="admin-btn admin-btn-sm admin-btn-danger"
                      >
                        Xóa
                      </Link>
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