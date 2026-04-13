import React, { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ProductList from "../components/ProductList";

/**
 * ProductsPage - hiển thị danh sách sản phẩm theo tag
 * category chính là tag (URL-decoded)
 */
function ProductsPage() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const filterTag = category ? decodeURIComponent(category) : null;

  const pageTitle = useMemo(() => {
    if (!filterTag) return "Tất cả sản phẩm";
    return filterTag.charAt(0).toUpperCase() + filterTag.slice(1);
  }, [filterTag]);

  return (
    <div className="page">
      <h2 className="page-title">{pageTitle}</h2>
      <ProductList filterTag={filterTag} searchQuery={searchQuery} />
    </div>
  );
}

export default ProductsPage;
