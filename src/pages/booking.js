import BookingServiceForm from "@/components/BookingServiceForm/BookingServiceForm";
import { PublicLayout } from "@/layout/PublicLayout";

import { Subscribe } from "@components/shared/Subscribe/Subscribe";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Booking",
    path: "/booking",
  },
];

const BookingPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Booking">
      <BookingServiceForm />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default BookingPage;
