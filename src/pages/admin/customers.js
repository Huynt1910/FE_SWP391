import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import Customers from "@/components/Admin/Customers/Customers";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý khách hàng",
    path: "/admin/customers",
  },
];

const CustomersPage = () => {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý khách hàng"
      >
        <Customers />
      </AdminLayout>
    </AuthGuard>
  );
};

export default CustomersPage;
