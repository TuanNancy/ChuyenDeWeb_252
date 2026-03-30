import React from 'react';
import ProductList from '../components/ProductList';
import './Page.css';

function HomePage() {
  return (
    <div className="page">
      <h2 className="pageTitle">Home</h2>
      <ProductList />
    </div>
  );
}

export default HomePage;
