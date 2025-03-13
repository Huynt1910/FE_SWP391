import { AdminLayout } from "@/components/Admin/AdminLayout";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/SystemAuthGuard";
import Dashboard from "@/components/Admin/Dashboard/Dashboard";
import { getCookie } from "cookies-next";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
];

const DashboardPage = () => {
  const userRole = getCookie("userRole");
  const dashboardTitle = `${
    userRole?.charAt(0).toUpperCase() + userRole?.slice(1)
  } Dashboard`;

  return (
    <SystemAuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle={dashboardTitle}
      >
        <Dashboard />
      </AdminLayout>
    </SystemAuthGuard>
  );
};

export default DashboardPage;
