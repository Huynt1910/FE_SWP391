import React from "react";
import Link from "next/link";
import { getCookie } from "cookies-next";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaBoxOpen,
  FaCog,
  FaUserClock,
} from "react-icons/fa";

const menuConfig = {
  admin: [
    { path: "/admin/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/admin/users", icon: <FaUsers />, label: "Quản lý người dùng" },
    { path: "/admin/services", icon: <FaBoxOpen />, label: "Quản lý dịch vụ" },
    {
      path: "/admin/bookings",
      icon: <FaCalendarAlt />,
      label: "Quản lý lịch hẹn",
    },
    {
      path: "/admin/schedules",
      icon: <FaUserClock />,
      label: "Quản lý lịch làm việc",
    },
    { path: "/admin/settings", icon: <FaCog />, label: "Cài đặt" },
  ],
};

const Sidebar = ({ isCollapsed }) => {
  // Temporarily set userRole to admin
  const userRole = "admin";
  const menuItems = menuConfig[userRole];

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar__brand">
        <img src="/assets/img/logo-admin.png" alt="Logo" />
        <span>BamboSpa Admin</span>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path} className="menu__link">
            <span className="menu__icon">{item.icon}</span>
            <span className="menu__text">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
