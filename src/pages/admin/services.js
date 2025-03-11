import { AdminLayout } from "@/components/Admin/AdminLayout";
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
    <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Quản lý dịch vụ">
      <Services />
    </AdminLayout>
  );
};

export default ServicesPage;
