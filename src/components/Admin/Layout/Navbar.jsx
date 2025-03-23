// src/components/Admin/Navbar/Navbar.jsx
import React, { useState } from "react";
import { FaBars, FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const Navbar = ({ onToggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Remove all authentication cookies
    deleteCookie("token");
    deleteCookie("userRole");
    deleteCookie("username");
    // Redirect to login page
    router.push("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="toggle-btn" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        {/* <div className="search-bar">
          <FaSearch />
          <input type="text" placeholder="Tìm kiếm..." />
        </div> */}
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
            {/* <img src="/avatar.jpg" alt="User" /> */}
            <span>Admin</span>
          </button>

          {showDropdown && (
            <div className="dropdown-menu">
              <a href="/admin/profile" className="dropdown-item">
                <FaUser />
                <span>Thông tin cá nhân</span>
              </a>
              <button onClick={handleLogout} className="dropdown-item">
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
