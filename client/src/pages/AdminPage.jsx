import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProductTable from "../components/admin/AdminProductTable";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminProductDelete from "../components/admin/AdminProductDelete";

function AdminPage() {
  return (
    <div className="page">
      <Routes>
        <Route index element={<AdminProductTable />} />
        <Route path="add" element={<AdminProductForm />} />
        <Route path="edit/:id" element={<AdminProductForm />} />
        <Route path="delete/:id" element={<AdminProductDelete />} />
      </Routes>
    </div>
  );
}

export default AdminPage;