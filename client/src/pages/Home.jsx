import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductList from '../components/ProductList';

function Home({ defaultPage = 'Home' }) {
  const menuItems = ['Home', 'About', 'Product', 'Contact'];
  const [activePage, setActivePage] = useState(defaultPage);

  const hashMap = {
    Home: 'home',
    About: 'about',
    Product: 'products',
    Contact: 'contact',
  };

  // Với react-router, không cần hash nữa; chỉ đổi state nội bộ
  const handleSelect = (item) => {
    setActivePage(item);
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar
          items={menuItems}
          activeItem={activePage}
          onSelect={handleSelect}
        />
        <div style={{ flex: 1, padding: '16px' }}>
          {activePage === 'Home' && (
            <div>
              <h2>Home</h2>
              <ProductList />
            </div>
          )}

          {activePage === 'About' && (
            <div>
              <h2>About</h2>
              <p>Đây là trang giới thiệu về shop của bạn.</p>
            </div>
          )}

          {activePage === 'Product' && (
            <div>
              <h2>Product</h2>
              <ProductList />
            </div>
          )}

          {activePage === 'Contact' && (
            <div>
              <h2>Contact</h2>
              <p>Thông tin liên hệ, email, số điện thoại...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;