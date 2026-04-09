import React from "react";
import deepSeekLogo from "../assets/deep-seek-logo-whale-1ced.png";

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <a href="/" className="logo-btn" aria-label="Trang chủ">
            <img src={deepSeekLogo} alt="Logo" className="logo-img" />
          </a>
        </div>

        <div className="header-search">
          <input
            type="search"
            className="search-input"
            placeholder="Tìm theo tên, mô tả, tag..."
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
