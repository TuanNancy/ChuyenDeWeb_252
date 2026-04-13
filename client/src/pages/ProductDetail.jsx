import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../api";

function ProductDetail() {
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

  if (loading)
    return (
      <div className="page">
        <p>Đang tải...</p>
      </div>
    );
  if (error)
    return (
      <div className="page">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!product)
    return (
      <div className="page">
        <p>Không có dữ liệu.</p>
      </div>
    );

  const imageUrl = product.images ? `${API_BASE}/${product.images}` : "";

  return (
    <div className="page product-detail-page">
      <Link to="/products" className="back-link">
        &larr; Quay lại
      </Link>
      <div className="product-detail">
        <div className="product-detail-left">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="product-detail-image-placeholder">Không có ảnh</div>
          )}
        </div>
        <div className="product-detail-right">
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-price">
            {typeof product.price === "number"
              ? `${product.price.toLocaleString("vi-VN")} đ`
              : product.price}
          </div>

          <div className="product-detail-info">
            <div className="product-detail-row">
              <span className="product-detail-label">Mã SP:</span>
              <span>{product.id}</span>
            </div>
            <div className="product-detail-row">
              <span className="product-detail-label">Bảo hành:</span>
              <span>{product.warranty || "Không có"}</span>
            </div>
            <div className="product-detail-row">
              <span className="product-detail-label">Tồn kho:</span>
              <span>{product.stock ?? 0}</span>
            </div>
          </div>

          {product.description && (
            <div className="product-detail-section">
              <h3>Mô tả</h3>
              <p>{product.description}</p>
            </div>
          )}

          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="product-detail-section">
                <h3>Thông số kỹ thuật</h3>
                <table className="spec-table">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-value">{String(value)}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="product-detail-section">
              <h3>Thẻ</h3>
              <div className="tag-list">
                {product.tags.map((tag, i) => (
                  <span key={i} className="tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
