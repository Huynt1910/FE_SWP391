import { AdminLayout } from "@/layout/AdminLayout";
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
    <AdminLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Quản lý người dùng"
    >
      <Users />
    </AdminLayout>
  );
};

export default UsersPage;
