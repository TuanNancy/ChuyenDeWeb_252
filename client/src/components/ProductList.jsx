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
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");

  useEffect(() => {
    const q = searchQuery.trim();
    const url = q
      ? `${API_BASE}/products/search?q=${encodeURIComponent(q)}`
      : `${API_BASE}/products`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Lỗi khi tải sản phẩm:", error);
      });
  }, [searchQuery]);

  /**
   * Trích xuất weight (số) từ sản phẩm
   * Ưu tiên: specifications.weightCapacity → specifications.weight → null
   */
  function getWeight(product) {
    const specs = product.specifications || {};
    const val = specs.weightCapacity || specs.weight || null;
    if (!val) return null;
    const num = parseFloat(String(val).replace(/[^\d.]/g, ""));
    return Number.isNaN(num) ? null : num;
  }

  const visible = useMemo(() => {
    let list = Array.isArray(products) ? products : [];

    // Lọc theo tag
    if (filterTag) {
      list = list.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes(filterTag),
      );
    }

    // Lọc theo tải trọng (weight)
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
      <div className="product-filters">
        <span className="product-filters-label">Tải trọng (kg)</span>
        <input
          type="number"
          className="product-filter-input"
          placeholder="Tối thiểu"
          min={0}
          aria-label="Tải trọng tối thiểu"
          value={minWeight}
          onChange={(e) => setMinWeight(e.target.value)}
        />
        <span className="product-filters-dash">—</span>
        <input
          type="number"
          className="product-filter-input"
          placeholder="Tối đa"
          min={0}
          aria-label="Tải trọng tối đa"
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
