import { AdminLayout } from "@/components/Admin/AdminLayout";
import Dashboard from "@/components/Admin/Dashboard/Dashboard";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
];

const AdminPage = () => {
  return (
    <AdminLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Dashboard">
      <Dashboard />
    </AdminLayout>
  );
};

export default AdminPage;
