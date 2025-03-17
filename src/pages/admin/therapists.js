import { AdminLayout } from "@/components/Admin/AdminLayout";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import Therapists from "@/components/Admin/Therapists/Therapists";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý Therapist",
    path: "/admin/therapists",
  },
];

const TherapistsPage = () => {
  return (
    <AuthGuard requiredRole="ADMIN">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý Therapist"
      >
        <Therapists />
      </AdminLayout>
    </AuthGuard>
  );
};

export default TherapistsPage;
