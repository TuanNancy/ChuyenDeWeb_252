import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE } from "../../api";

function AdminProductDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Xóa thất bại");
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error && !product) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="page admin-delete-page">
      <Link to="/admin" className="back-link">
        &larr; Quay lại danh sách
      </Link>

      <h3 className="admin-delete-title">Xác nhận xóa sản phẩm</h3>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-delete-info">
        <p>
          Bạn có chắc chắn muốn xóa sản phẩm này?
        </p>
        <div className="admin-delete-product">
          <strong>Mã SP:</strong> {product?.id}
        </div>
        <div className="admin-delete-product">
          <strong>Tên:</strong> {product?.name}
        </div>
        <div className="admin-delete-product">
          <strong>Giá:</strong>{" "}
          {typeof product?.price === "number"
            ? `${product.price.toLocaleString("vi-VN")} đ`
            : product?.price}
        </div>
      </div>

      <div className="admin-delete-actions">
        <button
          className="admin-btn admin-btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Đang xóa..." : "Xóa"}
        </button>
        <Link to="/admin" className="admin-btn admin-btn-secondary">
          Hủy
        </Link>
      </div>
    </div>
  );
}

export default AdminProductDelete;