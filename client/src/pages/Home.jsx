import React, { useState } from 'react';
import Header from '../components/Header';
import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ProductPage from './ProductPage';
import ContactPage from './ContactPage';

const NAV_ITEMS = [
  { key: 'Home', label: 'Home' },
  {
    key: 'Product',
    label: 'Product',
    children: [
      { key: 'Product', label: 'All products' },
      { key: 'Product', label: 'Promotions' },
    ],
  },
  {
    key: 'About',
    label: 'About',
    children: [{ key: 'About', label: 'Our story' }],
  },
  { key: 'Contact', label: 'Contact' },
];

function Home({ defaultPage = 'Home' }) {
  const [activePage, setActivePage] = useState(defaultPage);

  return (
    <div>
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        navItems={NAV_ITEMS}
      />
      <div style={{ padding: '16px' }}>
        {activePage === 'Home' && <HomePage />}
        {activePage === 'About' && <AboutPage />}
        {activePage === 'Product' && <ProductPage />}
        {activePage === 'Contact' && <ContactPage />}
      </div>
    </div>
  );
}

export default Home;
