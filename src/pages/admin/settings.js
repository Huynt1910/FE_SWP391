import { AdminLayout } from "@/layout/AdminLayout";
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
    <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Cài đặt">
      <Settings />
    </AdminLayout>
  );
};

export default SettingsPage;
