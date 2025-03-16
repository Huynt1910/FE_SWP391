import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
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
    <AuthGuard requiredRole="ADMIN">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý người dùng"
      >
        <Users />
      </AdminLayout>
    </AuthGuard>
  );
};

export default UsersPage;
