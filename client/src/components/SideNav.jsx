import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import menuItems from "../data/menu.json";

/**
 * SideNav đọc menu từ menu.json và render navigation
 * Hỗ trợ menu có children (submenu)
 */
function SideNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    menuItems.forEach((item) => {
      if (item.children?.length) {
        initial[item.path] = item.children.some(
          (child) => child.path === currentPath,
        );
      }
    });
    return initial;
  });

  const toggleGroup = (path) => {
    setOpenGroups((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Lọc menu theo role (tạm thời hiển thị tất cả vì chưa có auth)
  const visibleMenu = useMemo(() => {
    return menuItems;
  }, []);

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
