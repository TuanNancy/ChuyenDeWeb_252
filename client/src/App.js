import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/styles.css";

import MainLayout from "./components/MainLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/c/:category" element={<ProductsPage />} />
          <Route path="products/p/:id" element={<ProductDetail />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="admin/*" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
