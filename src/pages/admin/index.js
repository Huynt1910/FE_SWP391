import Orders from "@/components/Admin/Orders/Orders";
import Settings from "@/components/Admin/Settings/Settings";
import Users from "@/components/Admin/Users/Users";
import Products from "@/components/Product/Products/Products";
import { AdminLayout } from "@/layout/AdminLayout";
import Sidebar from "@components/Admin/Sidebar";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
];

const AdminPage = () => {
  return (
    <AdminLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Sidebar"
    ></AdminLayout>
  );
};

export default AdminPage;
