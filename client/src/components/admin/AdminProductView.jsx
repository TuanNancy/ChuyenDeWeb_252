import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../../api";

function AdminProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Không có dữ liệu.</p>;

  const imageUrl = product.images ? `${API_BASE}/${product.images}` : "";

  return (
    <div className="page admin-view-page">
      <div className="admin-view-header">
        <Link to="/admin" className="back-link">
          &larr; Quay lại danh sách
        </Link>
      </div>

      <div className="admin-view-actions">
        <Link to={`/admin/edit/${product.id}`} className="admin-btn admin-btn-warning">
          Sửa
        </Link>
      </div>

      <h3 className="admin-view-title">Chi tiết sản phẩm</h3>

      <div className="admin-view-info">
        <div className="admin-view-row">
          <span className="admin-view-label">Mã SP:</span>
          <span>{product.id}</span>
        </div>
        <div className="admin-view-row">
          <span className="admin-view-label">Tên sản phẩm:</span>
          <span>{product.name}</span>
        </div>
        <div className="admin-view-row">
          <span className="admin-view-label">Giá:</span>
          <span>
            {typeof product.price === "number"
              ? `${product.price.toLocaleString("vi-VN")} đ`
              : product.price}
          </span>
        </div>
        <div className="admin-view-row">
          <span className="admin-view-label">Tồn kho:</span>
          <span>{product.stock ?? 0}</span>
        </div>
        <div className="admin-view-row">
          <span className="admin-view-label">Bảo hành:</span>
          <span>{product.warranty || "Không có"}</span>
        </div>
      </div>

      {product.description && (
        <div className="admin-view-section">
          <h4>Mô tả</h4>
          <p>{product.description}</p>
        </div>
      )}

      {product.images && (
        <div className="admin-view-section">
          <h4>Ảnh sản phẩm</h4>
          <img src={`${API_BASE}/${product.images}`} alt={product.name} className="admin-view-image" />
        </div>
      )}

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="admin-view-section">
          <h4>Thông số kỹ thuật</h4>
          <table className="admin-view-table">
            <tbody>
              {Object.entries(product.specifications).map(([key, value]) => (
                <tr key={key}>
                  <td className="admin-view-key">{key}</td>
                  <td className="admin-view-value">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Array.isArray(product.tags) && product.tags.length > 0 && (
        <div className="admin-view-section">
          <h4>Tags</h4>
          <div className="tag-list">
            {product.tags.map((tag, i) => (
              <span key={i} className="tag-badge">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProductView;