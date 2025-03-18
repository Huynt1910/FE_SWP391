import { AdminLayout } from "@/components/Admin/AdminLayout";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/SystemAuthGuard";
import Users from "@/components/Admin/Users/Users";

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
    label: "Users",
    path: "/admin/users",
  },
];

const UsersPage = () => {
  return (
    <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Manage Users">
      <Users />
    </AdminLayout>
  );
};

export default UsersPage;
