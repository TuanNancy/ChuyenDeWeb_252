import React, { useEffect, useState } from 'react';
import deepSeekLogo from '../assets/deep-seek-logo-whale-1ced.png';
import './Header.css';

/**
 * @param {object} props
 * @param {string} props.activePage
 * @param {(page: string) => void} props.onNavigate
 * @param {{ key: string, label: string, children?: { key: string, label: string }[] }[]} props.navItems
 */
function Header({ activePage, onNavigate, navItems = [] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
  }, [activePage]);

  const go = (key) => {
    onNavigate(key);
    setMobileOpen(false);
  };

  const toggleMobileSub = (key) => {
    setMobileExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <header className="header">
      <div className="headerInner">
        <div className="headerLeft">
          <button
            type="button"
            className="hamburger"
            aria-label="Mở menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
          <button
            type="button"
            className="logoBtn"
            onClick={() => go('Home')}
            aria-label="Trang chủ"
          >
            <img
              src={deepSeekLogo}
              alt="Logo"
              className="logoImg"
            />
          </button>
        </div>

        <nav className="navDesktop" aria-label="Menu chính">
          {navItems.map((item) => {
            if (!item.children?.length) {
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`navLink${activePage === item.key ? ' active' : ''}`}
                  onClick={() => go(item.key)}
                >
                  {item.label}
                </button>
              );
            }
            return (
              <div key={item.key} className="navItemDropdown">
                <button type="button" className="navLink">
                  {item.label}
                  <span className="caret" aria-hidden>
                    ▼
                  </span>
                </button>
                <ul className="dropdownMenu" role="menu">
                  {item.children.map((child, idx) => (
                    <li key={`${item.key}-sub-${idx}`} role="none">
                      <button
                        type="button"
                        className="dropdownItem"
                        role="menuitem"
                        onClick={() => go(child.key)}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="headerSearch">
          <input
            type="search"
            className="searchInput"
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>
      </div>

      <div
        className={`mobileBackdrop${mobileOpen ? ' open' : ''}`}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      />

      <div
        className={`mobilePanel${mobileOpen ? ' open' : ''}`}
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
      >
        <div className="mobilePanelHeader">
          <h2 className="mobilePanelTitle">Menu</h2>
          <button
            type="button"
            className="closeMenuBtn"
            aria-label="Đóng menu"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
        </div>
        <ul className="mobileNavList">
          {navItems.map((item) => {
            if (!item.children?.length) {
              return (
                <li key={item.key} className="mobileNavItem">
                  <button
                    type="button"
                    className={`mobileNavSingle${activePage === item.key ? ' active' : ''}`}
                    onClick={() => go(item.key)}
                  >
                    {item.label}
                  </button>
                </li>
              );
            }
            const expanded = mobileExpanded === item.key;
            return (
              <li key={item.key} className="mobileNavItem">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className={`mobileNavTop${activePage === item.key ? ' active' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => go(item.key)}
                  >
                    {item.label}
                  </button>
                  <button
                    type="button"
                    className="mobileSubToggle"
                    aria-expanded={expanded}
                    aria-label={expanded ? 'Thu gọn' : 'Mở rộng'}
                    onClick={() => toggleMobileSub(item.key)}
                  >
                    {expanded ? '−' : '+'}
                  </button>
                </div>
                {expanded && (
                  <ul className="mobileSubList">
                    {item.children.map((child, idx) => (
                      <li key={`${item.key}-m-${idx}`}>
                        <button type="button" onClick={() => go(child.key)}>
                          {child.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default Header;
