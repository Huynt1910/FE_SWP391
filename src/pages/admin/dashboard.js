import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

import { getCookie } from "cookies-next";
import Dashboard from "@/components/Admin/Dashboard/Dashboard";

const breadcrumbsData = [
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
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle={dashboardTitle}
      >
        <Dashboard />
      </AdminLayout>
    </AuthGuard>
  );
};

export default DashboardPage;
