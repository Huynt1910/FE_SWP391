import { AdminLayout } from "@/components/Admin/AdminLayout";
import Dashboard from "@/components/Admin/Dashboard/Dashboard";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
];

const AdminPage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Admin Dashboard"
      >
        <Dashboard />
      </AdminLayout>
    </AuthGuard>
  );
};

export default AdminPage;
