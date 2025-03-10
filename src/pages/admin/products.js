import { AdminLayout } from "@/layout/AdminLayout";
import Products from "@/components/Admin/Products/Products";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý sản phẩm",
    path: "/admin/products",
  },
];

const ProductsPage = () => {
  return (
    <AdminLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Quản lý sản phẩm"
    >
      <Products />
    </AdminLayout>
  );
};

export default ProductsPage;
