import { AdminLayout } from "@/components/Admin/AdminLayout";
import Dashboard from "@/components/Admin/Dashboard/Dashboard";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
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
];

const AdminPage = () => {
  const userRole = getCookie("userRole");

  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle={`${userRole} Dashboard`}
      ></AdminLayout>
    </AuthGuard>
  );
};

export default AdminPage;
