import React, { useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaUserMd,
  FaUserAlt,
  FaChevronDown,
  FaChevronRight,
  FaTachometerAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaCog,
  FaUserClock,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/router";

const menuConfig = {
  admin: [
    { path: "/admin/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
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
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userSubMenu = [
    {
      path: "/admin/customers",
      icon: <FaUserAlt />,
      label: "Khách hàng",
    },
    {
      path: "/admin/staffs",
      icon: <FaUserTie />,
      label: "Nhân viên",
    },
    {
      path: "/admin/therapists",
      icon: <FaUserMd />,
      label: "Therapist",
    },
  ];

  const isActive = (path) => {
    if (path === "/admin/users" && router.pathname === path) {
      return true;
    }
    return router.pathname === path;
  };

  const isUserSection = userSubMenu.some((item) =>
    router.pathname.startsWith(item.path)
  );

  const userRole = "admin";
  const menuItems = menuConfig[userRole];

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar__brand">
        <img src="/assets/img/logo-admin.png" alt="Logo" />
        <span>BamboSpa Admin</span>
      </div>

      <nav className="menu">
        <div className={`sidebar-item ${isUserSection ? "active" : ""}`}>
          <button
            className={`sidebar-button ${isUserSection ? "active" : ""}`}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            <FaUsers />
            <span>Quản lý tài khoản</span>
            {userMenuOpen ? <FaChevronDown /> : <FaChevronRight />}
          </button>

          <div className={`submenu ${userMenuOpen ? "open" : ""}`}>
            {userSubMenu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`submenu-item ${
                  isActive(item.path) ? "active" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`menu__link ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="menu__icon">{item.icon}</span>
            <span className="menu__text">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
