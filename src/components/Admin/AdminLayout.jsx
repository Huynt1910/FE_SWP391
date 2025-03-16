import React, { useState } from "react";
import Sidebar from "./Layout/Sidebar";
import Navbar from "./Layout/Navbar";

export const AdminLayout = ({ children, breadcrumb, breadcrumbTitle }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`admin-layout ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="admin-layout__main">
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          breadcrumb={breadcrumb}
          breadcrumbTitle={breadcrumbTitle}
        />
        <div className="admin-layout__content">{children}</div>
      </div>
    </div>
  );
};
