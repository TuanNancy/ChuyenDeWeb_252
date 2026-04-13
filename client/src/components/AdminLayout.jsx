import React from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';

function AdminLayout() {
  const location = useLocation();
  const { id } = useParams();
  const isActive = (path) => location.pathname === path;
  
  return (
    <div className="app-layout">
      <header className="admin-header">
        <h1>Quản trị</h1>
      </header>
      <div className="body-wrapper">
        <nav className="admin-side-nav" aria-label="Menu quản trị">
          <ul className="side-nav-list">
            <li>
              <Link 
                to="/admin" 
                className={`side-nav-link${isActive('/admin') ? ' active' : ''}`}
              >
                📋 Danh sách sản phẩm
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/add" 
                className={`side-nav-link${isActive('/admin/add') ? ' active' : ''}`}
              >
                ➕ Thêm sản phẩm
              </Link>
            </li>
            
            {id && (
              <li className="side-nav-group">
                <div className="side-nav-group-label">
                  <span>📦 SP: {id}</span>
                </div>
                <ul className="side-nav-sub-list">
                  <li>
                    <Link
                      to={`/admin/view/${id}`}
                      className={`side-nav-link${location.pathname.includes('/view') ? ' active' : ''}`}
                    >
                      👁 Xem chi tiết
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/admin/edit/${id}`}
                      className={`side-nav-link${location.pathname.includes('/edit') ? ' active' : ''}`}
                    >
                      ✏️ Sửa sản phẩm
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/admin/delete/${id}`}
                      className={`side-nav-link${location.pathname.includes('/delete') ? ' active' : ''}`}
                    >
                      🗑 Xóa sản phẩm
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </nav>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;