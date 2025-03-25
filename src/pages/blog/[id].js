import { Post } from "@/components/Blog/Post/Post";
import { PublicLayout } from "@/layout/PublicLayout";
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
const PostPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Blog">
      <Post />
    </PublicLayout>
  );
};

export default PostPage;
