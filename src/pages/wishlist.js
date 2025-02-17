import { PublicLayout } from "@/layout/PublicLayout";
import { MostViewed } from "@components/shared/MostViewed/MostViewed";
import { Wishlist } from "@components/Wishlist/Wishlist";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Wishlist",
    path: "/wishlist",
  },
];
const WishlistPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Wishlist">
      <Wishlist />
      <MostViewed />
    </PublicLayout>
  );
};

export default WishlistPage;
