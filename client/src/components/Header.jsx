import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import deepSeekLogo from "../assets/deep-seek-logo-whale-1ced.png";

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <a href="/" className="logo-btn" aria-label="Trang chủ">
            <img src={deepSeekLogo} alt="Logo" className="logo-img" />
          </a>
        </div>

        <div className="header-search">
          <form onSubmit={handleSearch}>
            <input
              type="search"
              className="search-input"
              placeholder="Tìm theo tên, mô tả, tag..."
              aria-label="Tìm kiếm sản phẩm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
        </div>
      </div>
    </header>
  );
}

export default Header;
