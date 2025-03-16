import { AdminLayout } from "@/components/Admin/AdminLayout";
import ScheduleTherapist from "@/components/Admin/ScheduleTherapist/ScheduleTherapist";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Quản lý lịch làm việc",
    path: "/admin/schedules",
  },
];

const SchedulesPage = () => {
  return (
    <AuthGuard>
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý lịch làm việc"
      >
        <ScheduleTherapist />
      </AdminLayout>
    </AuthGuard>
  );
};

export default SchedulesPage;
