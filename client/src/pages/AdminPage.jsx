import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProductTable from "../components/admin/AdminProductTable";
import AdminProductForm from "../components/admin/AdminProductForm";
import AdminProductDelete from "../components/admin/AdminProductDelete";
import AdminProductView from "../components/admin/AdminProductView";
import ImportCSV from "../components/admin/ImportCSV";

function AdminPage() {
  return (
    <div className="page">
      <Routes>
        <Route index element={<AdminProductTable />} />
        <Route path="add" element={<AdminProductForm />} />
        <Route path="view/:id" element={<AdminProductView />} />
        <Route path="edit/:id" element={<AdminProductForm />} />
        <Route path="delete/:id" element={<AdminProductDelete />} />
        <Route path="import" element={<ImportCSV />} />
      </Routes>
    </div>
  );
}

export default AdminPage;