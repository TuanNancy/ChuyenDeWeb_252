import React, { useEffect, useState } from 'react';
import { API_BASE } from '../api';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const url = `${API_BASE}/products`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <section id="products" className="productListSection">
      <div className="productGrid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductList;

