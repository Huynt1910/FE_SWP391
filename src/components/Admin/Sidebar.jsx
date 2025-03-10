import React from "react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", path: "/admin" },
    { text: "Quản lý người dùng", path: "/admin/users" },
    { text: "Quản lý sản phẩm", path: "/admin/products" },
    { text: "Quản lý đơn hàng", path: "/admin/orders" },
    { text: "Cài đặt", path: "/admin/settings" },
  ];

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path} legacyBehavior>
                <a>{item.text}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
