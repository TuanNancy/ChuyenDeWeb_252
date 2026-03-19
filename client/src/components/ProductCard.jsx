import React from 'react';

function ProductCard({ product }) {
  const { name, price, image } = product;
  const imageUrl = image ? `http://localhost:5000/${image}` : '';

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
      <div style={{ color: '#ff5722' }}>{price}</div>
    </div>
  );
}

export default ProductCard;
