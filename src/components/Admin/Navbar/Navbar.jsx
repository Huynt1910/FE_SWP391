import React, { useState } from "react";
import { FaSearch, FaBell, FaBars } from "react-icons/fa";
import { useRouter } from "next/router";

const Navbar = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // Xử lý logout
    console.log("Logout clicked");
  };

  return (
    <div className="navbar">
      <div className="navbar__left">
        {/* Nút toggle sidebar */}
        <button className="navbar__sidebar-toggle" onClick={onToggleSidebar}>
          <FaBars className="navbar__icon" />
        </button>

        {/* Thanh search */}
        <div className="navbar__search">
          <FaSearch className="navbar__icon" />
          <input
            type="text"
            placeholder="Search..."
            className="navbar__search-input"
          />
        </div>
      </div>
      <div className="navbar__right">
        <button className="navbar__notification">
          <FaBell className="navbar__icon" />
        </button>
        <div className="navbar__profile" onClick={toggleDropdown}>
          <img
            src="/path/to/avatar.jpg" // Cập nhật đúng đường dẫn
            alt="Admin"
            className="navbar__profile-image"
          />
          {dropdownOpen && (
            <div className="navbar__dropdown">
              <button className="navbar__dropdown-item">Profile</button>
              <button className="navbar__dropdown-item">Settings</button>
              <button className="navbar__dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
