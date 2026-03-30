import React from 'react';
import { API_BASE } from '../api';

function ProductCard({ product }) {
  const { name, price, images } = product;
  const imageUrl = images ? `${API_BASE}/${images}` : '';

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          width: '100%',
          paddingTop: '56.25%',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          marginBottom: '8px',
          backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div style={{ fontWeight: 600 }}>{name}</div>
      <div style={{ color: '#ff5722' }}>
        {typeof price === 'number'
          ? `${price.toLocaleString('vi-VN')} đ`
          : price}
      </div>
    </div>
  );
}

export default ProductCard;
