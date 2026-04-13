import React from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE } from "../../api";

function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        return res.json();
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        navigate("/admin");
      });
  }, [id, navigate]);

  if (loading) {
    return <div className="page"><p>Đang tải...</p></div>;
  }

  return (
    <div className="page">
      <Outlet />
    </div>
  );
}

export default AdminProductDetail;