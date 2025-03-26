import { AdminLayout } from "@/components/Admin/AdminLayout";

import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import { TherapistProfile } from "@/components/Admin/TherapistProfile/TherapistProfile";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Lịch làm việc của tôi",
    path: "/admin/therapist-profile",
  },
];

const TherapistSchedulePage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Lịch làm việc của tôi"
      >
        <TherapistProfile />
      </AdminLayout>
    </AuthGuard>
  );
};

export default TherapistSchedulePage;
