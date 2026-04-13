import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import deepSeekLogo from "../assets/deep-seek-logo-whale-1ced.png";

const DEBOUNCE_DELAY = 500;

function Header() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(keyword);
  };

  const performSearch = (q) => {
    const trimmed = q.trim();
    if (trimmed) {
      navigate(`/products/search?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/products");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      performSearch(value);
    }, DEBOUNCE_DELAY);
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <a href="/" className="logo-btn" aria-label="Trang chủ">
            <img src={deepSeekLogo} alt="Biểu tượng" className="logo-img" />
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
              onChange={handleChange}
            />
          </form>
        </div>
      </div>
    </header>
  );
}

export default Header;
