import React, { useState } from "react";
import Sidebar from "./Layout/Sidebar";
import Navbar from "./Layout/Navbar";
import { getCookie } from "cookies-next";

export const AdminLayout = ({ children, breadcrumb, breadcrumbTitle }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const userRole = getCookie("userRole");

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`admin-layout ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <Sidebar isCollapsed={isSidebarCollapsed} userRole={userRole} />
      <div className="admin-layout__main">
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          userRole={userRole}
          breadcrumb={breadcrumb}
          breadcrumbTitle={breadcrumbTitle}
        />
        <div className="admin-layout__content">{children}</div>
      </div>
    </div>
  );
};
