import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import menuItems from "../data/menu.json";
import { API_BASE } from "../api";

/**
 * SideNav đọc menu từ menu.json và render navigation
 * Submenu "Sản phẩm" được sinh tự động từ tags trong database
 */
function SideNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    menuItems.forEach((item) => {
      if (item.path === "/products" || item.path === "/") {
        initial[item.path] = item.children
          ? item.children.some((child) => child.path === currentPath)
          : currentPath === item.path;
      }
    });
    return initial;
  });

  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then((res) => res.json())
      .then((data) => {
        const tagCount = {};
        (Array.isArray(data) ? data : []).forEach((p) => {
          (p.tags || []).forEach((t) => {
            tagCount[t] = (tagCount[t] || 0) + 1;
          });
        });
        // Lọc tag có >= 3 sản phẩm, sắp xếp giảm dần, lấy top 5
        const filtered = Object.entries(tagCount)
          .filter(([, count]) => count >= 3)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag]) => tag);
        setTags(filtered);
      })
      .catch(() => setTags([]));
  }, []);

  const toggleGroup = (path) => {
    setOpenGroups((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const visibleMenu = useMemo(() => {
    return menuItems.map((item) => {
      if (item.path === "/products" && item.children !== false) {
        const dynamicChildren = [
          { label: "Tất cả", path: "/products" },
          ...tags.map((t) => ({
            label: t.charAt(0).toUpperCase() + t.slice(1),
            path: `/products/c/${encodeURIComponent(t)}`,
            filterTag: t,
          })),
        ];
        return { ...item, children: dynamicChildren };
      }
      return item;
    });
  }, [tags]);

  return (
    <nav className="side-nav" aria-label="Menu chính">
      <ul className="side-nav-list">
        {visibleMenu.map((item) => {
          // Menu item có children (submenu)
          if (item.children?.length) {
            const expanded = !!openGroups[item.path];

            return (
              <li key={item.path} className="side-nav-group">
                <button
                  type="button"
                  className="side-nav-toggle"
                  aria-expanded={expanded}
                  onClick={() => toggleGroup(item.path)}
                >
                  <span className="side-nav-toggle-label">{item.label}</span>
                  <span className="side-nav-caret" aria-hidden>
                    {expanded ? "▼" : "▶"}
                  </span>
                </button>
                {expanded && (
                  <ul className="side-nav-sub-list">
                    {item.children.map((child) => {
                      const childActive = child.path === currentPath;
                      return (
                        <li key={child.path}>
                          <Link
                            to={child.path}
                            className={`side-nav-link${childActive ? " active" : ""}`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          }

          // Menu item thường (không có children)
          const isActive = item.path === currentPath;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`side-nav-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SideNav;
