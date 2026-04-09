import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import SideNav from '../components/SideNav';

/**
 * MainLayout - Layout chính của ứng dụng
 * Bao gồm: Header (trên), SideNav (trái), nội dung (phải)
 */
function MainLayout() {
  return (
    <div className="app-layout">
      <Header />
      <div className="body-wrapper">
        <SideNav />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
