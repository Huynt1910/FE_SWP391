import { PublicLayout } from "@/layout/PublicLayout";
import { Category } from "@components/Category/Category";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Categories",
    path: "/categories",
  },
];
const CategoriesPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Categories">
      <Category />
    </PublicLayout>
  );
};

export default CategoriesPage;
