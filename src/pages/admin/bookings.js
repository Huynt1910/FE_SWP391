import { AdminLayout } from "@/components/Admin/AdminLayout";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/SystemAuthGuard";
import Bookings from "@/components/Admin/Bookings/Bookings";

const breadcrumbsData = [
  {
    label: "Admin",
    path: "/admin",
  },
  {
    label: "Lịch hẹn",
    path: "/admin/bookings",
  },
];

const BookingsPage = () => {
  return (
    <SystemAuthGuard requiredRole="therapist">
      <AdminLayout
        breadcrumb={breadcrumbsData}
        breadcrumbTitle="Quản lý lịch hẹn"
      >
        <Bookings />
      </AdminLayout>
    </SystemAuthGuard>
  );
};

export default BookingsPage;
