// src/components/Admin/Navbar/Navbar.jsx
import React from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";

const Navbar = ({ onToggleSidebar }) => {
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
      </div>

      <div className="navbar-right">
        <button className="btn btn-outline" onClick={handleLogout}>
          <FaSignOutAlt className="btn-icon" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Navbar;
