import React from 'react';

function Header() {
  const logoUrl =
    'http://localhost:5000/images/Logo-Dai-Hoc-Van-Lang-H-1024x254.webp';

  return (
    <header
      style={{
        padding: '12px 24px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <img
          src={logoUrl}
          alt="Van Lang University Logo"
          style={{ height: '40px', objectFit: 'contain' }}
        />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '8px 12px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
