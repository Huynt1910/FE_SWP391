import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
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
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý dịch vụ"
      >
        <Services />
      </AdminLayout>
    </AuthGuard>
  );
};

export default ServicesPage;
