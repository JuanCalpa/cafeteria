import { useState } from 'react';

const Sidebar = ({ items, onLogout }) => {
  const [activeItem, setActiveItem] = useState(items[0]?.id || null);

  const handleItemClick = (item) => {
    setActiveItem(item.id);
    if (item.onClick) {
      item.onClick();
    }
  };

  return (
    <div className="sidebar">
      <h2>☕ Cafetería</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className={activeItem === item.id ? 'active' : ''}
            onClick={() => handleItemClick(item)}
          >
            {item.label}
          </li>
        ))}
        <li onClick={onLogout} style={{ marginTop: '20px', background: '#8d6e63' }}>
          Cerrar Sesión
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;