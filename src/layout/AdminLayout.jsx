import React, { useState } from "react";
import Navbar from "@/components/Admin/Navbar/Navbar";
import Sidebar from "@/components/Admin/Sidebar";

export const AdminLayout = ({ children, breadcrumb, breadcrumbTitle }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setSidebarExpanded((prev) => !prev);
  };

  return (
    <div
      className={`admin-container ${sidebarExpanded ? "sidebar-expanded" : ""}`}
    >
      {/* Sidebar cố định */}
      <aside
        className={`admin-sidebar ${
          sidebarExpanded ? "expanded" : "collapsed"
        }`}
      >
        <Sidebar expanded={sidebarExpanded} />
      </aside>

      <div className="admin-main">
        {/* Navbar cố định */}
        <header className="admin-navbar">
          <Navbar onToggleSidebar={toggleSidebar} />
        </header>

        {/* Nội dung trang */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};
