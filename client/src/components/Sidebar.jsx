import React from 'react';

function Sidebar({ items = [], activeItem, onSelect }) {
  return (
    <aside
      style={{
        width: '220px',
        borderRight: '1px solid #eee',
        padding: '16px',
        backgroundColor: '#fafafa',
        boxSizing: 'border-box',
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '12px' }}>Danh mục</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.length === 0 && <li>Không có mục nào</li>}
        {items.map((item, index) => {
          const isActive = item === activeItem;
          return (
            <li
              key={index}
              onClick={() => onSelect && onSelect(item)}
              style={{
                padding: '8px 0',
                cursor: 'pointer',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? '#1976d2' : 'inherit',
              }}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
