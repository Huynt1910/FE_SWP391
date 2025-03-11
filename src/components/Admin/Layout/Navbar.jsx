// src/components/Admin/Navbar/Navbar.jsx
import React, { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = ({ onToggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <div className="search-bar">
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="notification-btn">
          <FaBell />
          <span className="badge">3</span>
        </button>

        <div className="user-menu">
          <button
            className="user-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img src="/avatar.jpg" alt="User" />
            <span>Admin</span>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <a href="/admin/profile">
                <FaUser />
                Thông tin cá nhân
              </a>
              <a href="/admin/settings">
                <FaCog />
                Cài đặt
              </a>
              <a href="/logout">
                <FaSignOutAlt />
                Đăng xuất
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
