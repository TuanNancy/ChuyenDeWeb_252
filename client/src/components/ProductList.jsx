import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../api";
import ProductCard from "./ProductCard";

function matchesKeyword(product, q) {
  const lower = q.toLowerCase();
  if (product.name?.toLowerCase().includes(lower)) return true;
  if (product.description?.toLowerCase().includes(lower)) return true;
  if (Array.isArray(product.tags)) {
    return product.tags.some((t) => t.toLowerCase().includes(lower));
  }
  return false;
}

/**
 * ProductList - hiển thị danh sách sản phẩm với bộ lọc
 * @param {object} props
 * @param {string | null} [props.filterTag] - tag để lọc sản phẩm
 * @param {string} [props.searchQuery] - từ khóa tìm kiếm
 */
function ProductList({ filterTag = null, searchQuery = "" }) {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const url = `${API_BASE}/products`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Lỗi khi tải sản phẩm:", error);
      });
  }, []);

  const visible = useMemo(() => {
    let list = products;

    // Lọc theo tag
    if (filterTag) {
      list = list.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes(filterTag),
      );
    }

    // Lọc theo từ khóa tìm kiếm
    const q = searchQuery.trim();
    if (q) {
      list = list.filter((p) => matchesKeyword(p, q));
    }

    // Lọc theo giá
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);
    if (min != null && !Number.isNaN(min)) {
      list = list.filter((p) => typeof p.price === "number" && p.price >= min);
    }
    if (max != null && !Number.isNaN(max)) {
      list = list.filter((p) => typeof p.price === "number" && p.price <= max);
    }

    return list;
  }, [products, filterTag, searchQuery, minPrice, maxPrice]);

  return (
    <section className="product-list-section">
      <div className="product-filters">
        <span className="product-filters-label">Giá (VNĐ)</span>
        <input
          type="number"
          className="product-filter-input"
          placeholder="Tối thiểu"
          min={0}
          aria-label="Giá tối thiểu"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <span className="product-filters-dash">—</span>
        <input
          type="number"
          className="product-filter-input"
          placeholder="Tối đa"
          min={0}
          aria-label="Giá tối đa"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
