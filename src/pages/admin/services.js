import { AdminLayout } from "@/components/Admin/AdminLayout";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/SystemAuthGuard";
import Services from "@/components/Admin/Services/Services";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Dịch vụ",
    path: "/admin/services",
  },
];

const ServicesPage = () => {
  return (
    <SystemAuthGuard requiredRole="staff">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý dịch vụ"
      >
        <Services />
      </AdminLayout>
    </SystemAuthGuard>
  );
};

export default ServicesPage;
