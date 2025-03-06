import { PublicLayout } from "@/layout/PublicLayout";
import { Faq } from "@components/Faq/Faq";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "FAQ",
    path: "/faq",
  },
];
const CartPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="FAQ">
      <Faq />
      <Subscribe />
    </PublicLayout>
  );
};

export default CartPage;
