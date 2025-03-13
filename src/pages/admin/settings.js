import { AdminLayout } from "@/components/Admin/AdminLayout";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/SystemAuthGuard";
import Settings from "@/components/Admin/Settings/Settings";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Cài đặt",
    path: "/admin/settings",
  },
];

const SettingsPage = () => {
  return (
    <SystemAuthGuard requiredRole="admin">
      <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Cài đặt">
        <Settings />
      </AdminLayout>
    </SystemAuthGuard>
  );
};

export default SettingsPage;
