import React from "react";
import Link from "next/link";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaCog,
  FaChartBar,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed }) => {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar__brand">
        <img src="/logo.png" alt="Logo" />
        <span>BeShop Admin</span>
      </div>

      <nav className="menu">
        <div className="menu__section">
          <div className="section__title">Tổng quan</div>
          <Link href="/admin" className="menu__link">
            <span className="menu__icon">
              <FaTachometerAlt />
            </span>
            <span className="menu__text">Dashboard</span>
          </Link>
        </div>

        <div className="menu__section">
          <div className="section__title">Quản lý</div>
          <Link href="/admin/bookings" className="menu__link">
            <span className="menu__icon">
              <FaCalendarAlt />
            </span>
            <span className="menu__text">Lịch hẹn</span>
          </Link>
          <Link href="/admin/users" className="menu__link">
            <span className="menu__icon">
              <FaUsers />
            </span>
            <span className="menu__text">Người dùng</span>
          </Link>
          <Link href="/admin/services" className="menu__link">
            <span className="menu__icon">
              <FaChartBar />
            </span>
            <span className="menu__text">Dịch vụ</span>
          </Link>
        </div>

        <div className="menu__section">
          <div className="section__title">Cài đặt</div>
          <Link href="/admin/settings" className="menu__link">
            <span className="menu__icon">
              <FaCog />
            </span>
            <span className="menu__text">Thiết lập</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
