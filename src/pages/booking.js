import BookingForm from "@/components/BookingForm/BookingForm";
import { PublicLayout } from "@/layout/PublicLayout";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const breadcrumbsData = [
  { label: "Home", path: "/" },
  { label: "Booking", path: "/booking" },
];

const BookingPage = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Booking">
        <BookingForm />
        <Subscribe />
      </PublicLayout>
    </LocalizationProvider>
  );
};

export default BookingPage;
