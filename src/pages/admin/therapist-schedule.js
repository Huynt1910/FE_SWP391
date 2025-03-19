import { AdminLayout } from "@/components/Admin/AdminLayout";
import { TherapistSchedule } from "@/components/Admin/TherapistSchedule/TherapistSchedule";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Lịch làm việc của tôi",
    path: "/admin/therapist-schedule",
  },
];

const TherapistSchedulePage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Lịch làm việc của tôi"
      >
        <TherapistSchedule />
      </AdminLayout>
    </AuthGuard>
  );
};

export default TherapistSchedulePage;
