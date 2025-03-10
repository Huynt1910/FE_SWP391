import { PublicLayout } from "@/layout/PublicLayout";
import { Profile } from "@components/Profile/Profile";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "My Profile",
    path: "/profile",
  },
];
const ProfilePage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="My Profile">
      <Profile />
    </PublicLayout>
  );
};

export default ProfilePage;
