import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../api";
import ProductCard from "./ProductCard";

/**
 * ProductList - hiển thị danh sách sản phẩm với bộ lọc
 * @param {object} props
 * @param {string | null} [props.filterTag] - tag để lọc sản phẩm
 * @param {string} [props.searchQuery] - từ khóa tìm kiếm
 */
function ProductList({ filterTag = null, searchQuery = "" }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");

  useEffect(() => {
    const q = searchQuery.trim();
    const url = q
      ? `${API_BASE}/products/search?q=${encodeURIComponent(q)}`
      : `${API_BASE}/products`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        setProducts([]);
      });
  }, [searchQuery]);

  /**
   * Trích xuất trọng lượng (gam) từ specifications và description
   */
  function getWeight(product) {
    const specs = product.specifications || {};
    const values = Object.values(specs);
    
    for (const val of values) {
      const str = String(val).toLowerCase();
      
      const kgMatch = str.match(/(\d+\.?\d*)\s*kg/);
      if (kgMatch) return parseFloat(kgMatch[1]) * 1000;
      
      const gMatch = str.match(/(\d+\.?\d*)\s*g$/);
      if (gMatch) return parseFloat(gMatch[1]);
    }
    
    const desc = String(product.description || "").toLowerCase();
    const descGMatch = desc.match(/(\d+\.?\d*)\s*g/);
    if (descGMatch) return parseFloat(descGMatch[1]);
    
    return null;
  }

  const visible = useMemo(() => {
    let list = Array.isArray(products) ? products : [];

    if (filterTag) {
      list = list.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes(filterTag),
      );
    }

    const wMin = minWeight === "" ? null : Number(minWeight);
    const wMax = maxWeight === "" ? null : Number(maxWeight);
    if (wMin != null && !Number.isNaN(wMin)) {
      list = list.filter((p) => {
        const w = getWeight(p);
        return w != null && w >= wMin;
      });
    }
    if (wMax != null && !Number.isNaN(wMax)) {
      list = list.filter((p) => {
        const w = getWeight(p);
        return w != null && w <= wMax;
      });
    }

    return list;
  }, [products, filterTag, minWeight, maxWeight]);

  return (
    <section className="product-list-section">
      {error && (
        <div className="error-message" role="alert">
          Không thể tải sản phẩm: {error}
        </div>
      )}
      <div className="product-filters">
        <span className="product-filters-label">Trọng lượng (g)</span>
        <input
          type="number"
          className="product-filter-input"
          placeholder="Tối thiểu"
          min={0}
          aria-label="Trọng lượng tối thiểu"
          value={minWeight}
          onChange={(e) => setMinWeight(e.target.value)}
        />
        <span className="product-filters-dash">—</span>
        <input
          type="number"
          className="product-filter-input"
          placeholder="Tối đa"
          min={0}
          aria-label="Trọng lượng tối đa"
          value={maxWeight}
          onChange={(e) => setMaxWeight(e.target.value)}
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
