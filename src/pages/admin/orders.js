import { AdminLayout } from "@/layout/AdminLayout";
import Orders from "@components/Admin/Orders/Orders";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý đơn hàng",
    path: "/admin/orders",
  },
];

const OrdersPage = () => {
  return (
    <AdminLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Quản lý đơn hàng"
    >
      <Orders />
    </AdminLayout>
  );
};

export default OrdersPage;
