import { AdminLayout } from "@/components/Admin/AdminLayout";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/SystemAuthGuard";
import Users from "@/components/Admin/Users/Users";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý người dùng",
    path: "/admin/users",
  },
];

const UsersPage = () => {
  return (
    <SystemAuthGuard requiredRole="admin">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý người dùng"
      >
        <Users />
      </AdminLayout>
    </SystemAuthGuard>
  );
};

export default UsersPage;
