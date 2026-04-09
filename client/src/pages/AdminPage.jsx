import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProductTable from "../components/admin/AdminProductTable";
import AdminProductForm from "../components/admin/AdminProductForm";

function AdminPage() {
  return (
    <div className="page">
      <h2 className="page-title">Quản trị</h2>
      <Routes>
        <Route index element={<AdminProductTable />} />
        <Route path="add" element={<AdminProductForm />} />
        <Route path="edit/:id" element={<AdminProductForm />} />
      </Routes>
    </div>
  );
}

export default AdminPage;
