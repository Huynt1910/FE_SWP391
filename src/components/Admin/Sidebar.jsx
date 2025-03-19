import React from "react";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";

const Sidebar = ({ expanded }) => {
  const menuItems = [
    { text: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { text: "Quản lý người dùng", path: "/admin/users", icon: <FaUsers /> },
    { text: "Quản lý sản phẩm", path: "/admin/products", icon: <FaBoxOpen /> },
    {
      text: "Quản lý đơn hàng",
      path: "/admin/orders",
      icon: <FaShoppingCart />,
    },
    { text: "Cài đặt", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <div className="sidebar">
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path} legacyBehavior>
                <a className="sidebar__link">
                  {item.icon}
                  {expanded && (
                    <span className="sidebar__text">{item.text}</span>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
