import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import Settings from "@/components/Admin/Settings/Settings";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý Voucher",
    path: "/admin/staff-profile",
  },
];

const SettingsPage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Thông tin cá nhân của staff"
      >
        <Settings />
      </AdminLayout>
    </AuthGuard>
  );
};

export default SettingsPage;
