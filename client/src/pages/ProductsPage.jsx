import React, { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import menuItems from "../data/menu.json";

/**
 * ProductsPage - hiển thị danh sách sản phẩm theo category
 * Đọc filterTag từ menu.json dựa trên URL path
 */
function ProductsPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  // Tìm filterTag từ menu.json dựa trên category slug
  const filterTag = useMemo(() => {
    const productsItem = menuItems.find((item) => item.label === "Sản phẩm");
    if (!productsItem?.children) return null;

    // Nếu category là 'all' hoặc không có -> không lọc
    if (!category || category === "all") return null;

    // Tìm child có path khớp với category
    const matchedChild = productsItem.children.find((child) => {
      const childSlug = child.path.split("/").pop();
      return childSlug === category;
    });

    return matchedChild?.filterTag ?? null;
  }, [category]);

  // Lấy tiêu đề trang
  const pageTitle = useMemo(() => {
    if (!category || category === "all") return "Tất cả sản phẩm";

    const productsItem = menuItems.find((item) => item.label === "Sản phẩm");
    if (!productsItem?.children) return "Sản phẩm";

    const matchedChild = productsItem.children.find((child) => {
      const childSlug = child.path.split("/").pop();
      return childSlug === category;
    });

    return matchedChild?.label || "Sản phẩm";
  }, [category]);

  return (
    <div className="page">
      <h2 className="page-title">{pageTitle}</h2>
      <ProductList filterTag={filterTag} searchQuery={searchQuery} />
    </div>
  );
}

export default ProductsPage;
