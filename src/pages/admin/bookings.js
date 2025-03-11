import { AdminLayout } from "@/components/Admin/AdminLayout";
import BookingSchedule from "@/components/Admin/Booking/BookingSchedule";

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
    <AdminLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Quản lý lịch hẹn"
    >
      <BookingSchedule />
    </AdminLayout>
  );
};

export default BookingsPage;
