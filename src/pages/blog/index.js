import { PublicLayout } from "@/layout/PublicLayout";
import { Blog } from "@components/Blog/Blog";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Blog",
    path: "/blog",
  },
];
const BlogPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Blog">
      <Blog />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default BlogPage;
