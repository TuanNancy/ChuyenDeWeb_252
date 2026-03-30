import React from 'react';
import ProductList from '../components/ProductList';
import './Page.css';

function ProductPage() {
  return (
    <div className="page">
      <h2 className="pageTitle">Product</h2>
      <ProductList />
    </div>
  );
}

export default ProductPage;
