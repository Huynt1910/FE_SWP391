import { PublicLayout } from "@/layout/PublicLayout";
import { Cart } from "@components/Cart/Cart";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Cart",
    path: "/cart",
  },
];
const CartPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Cart">
      <Cart />
    </PublicLayout>
  );
};

export default CartPage;
