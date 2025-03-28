import { PublicLayout } from "@/layout/PublicLayout";
import { Checkout } from "@components/Checkout/Checkout";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Shop",
    path: "/shop",
  },
  {
    label: "Checkout",
    path: "/checkout",
  },
];
const CheckoutPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Checkout">
      <Checkout />
    </PublicLayout>
  );
};

export default CheckoutPage;
