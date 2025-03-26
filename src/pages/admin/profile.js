import AdminLayout from "@/components/Admin/AdminLayout";
import { TherapistProfile } from "@/components/Admin/TherapistProfile/TherapistProfile";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Thông tin cá nhân",
    path: "/admin/profile",
  },
];

const ProfilePage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Thông tin cá nhân"
      >
        <TherapistProfile />
      </AdminLayout>
    </AuthGuard>
  );
};

export default ProfilePage;
