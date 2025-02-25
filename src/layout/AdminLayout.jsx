import Sidebar from "@/components/Admin/Sidebar";
import { Breadcrumb } from "@components/shared/Breadcrumb/Breadcrumb";
import { Header } from "@components/shared/Header/Header";
export const AdminLayout = ({ children, breadcrumb, breadcrumbTitle }) => {
  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Sidebar />
      </aside>

      {/* Content Area */}
      <div className="admin-main">
        {/* Breadcrumb */}

        {/* Main Content */}
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};
