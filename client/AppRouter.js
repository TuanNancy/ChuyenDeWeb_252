import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home';

// Khai báo toàn bộ route một cách "dynamic" thông qua cấu hình
const routes = [
  {
    id: 'home',
    path: '/',
    element: <Home defaultPage="Home" />,
  },
  {
    id: 'about',
    path: '/about',
    element: <Home defaultPage="About" />,
  },
  {
    id: 'products',
    path: '/products',
    element: <Home defaultPage="Product" />,
  },
  {
    id: 'contact',
    path: '/contact',
    element: <Home defaultPage="Contact" />,
  },
];

function AppRouter() {
  return (
    <Router>
      <Routes>
        {routes.map(({ id, path, element }) => (
          <Route key={id} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}

export default AppRouter;