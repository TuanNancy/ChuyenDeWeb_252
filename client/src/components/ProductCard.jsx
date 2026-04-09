import React from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../api";

function ProductCard({ product }) {
  const { name, price, warranty, images } = product;
  const imageUrl = images ? `${API_BASE}/${images}` : "";

  return (
    <Link to={`/products/${product.id}`} style={styles.card}>
      <div
        style={{
          ...styles.imageWrapper,
          backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        }}
      />
      <div style={styles.name}>{name}</div>
      <div style={styles.price}>
        {typeof price === "number"
          ? `${price.toLocaleString("vi-VN")} đ`
          : price}
      </div>
      {warranty && <div style={styles.warranty}>BH: {warranty}</div>}
    </Link>
  );
}

const styles = {
  card: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "12px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    textDecoration: "none",
    color: "inherit",
    transition: "box-shadow 0.2s",
  },
  imageWrapper: {
    width: "100%",
    paddingTop: "56.25%",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    marginBottom: "8px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  name: {
    fontWeight: 600,
  },
  price: {
    color: "#ff5722",
  },
  warranty: {
    fontSize: "12px",
    color: "#666",
  },
};

export default ProductCard;
