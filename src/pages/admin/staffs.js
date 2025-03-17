import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import Staffs from "@/components/Admin/Staffs/Staffs";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý nhân viên",
    path: "/admin/staffs",
  },
];

const StaffsPage = () => {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý nhân viên"
      >
        <Staffs />
      </AdminLayout>
    </AuthGuard>
  );
};

export default StaffsPage;
