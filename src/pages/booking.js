import BookingScreen, {
  BookingServiceForm,
} from "@/components/BookingServiceForm/BookingServiceForm";
import SurveyForm from "@/components/SurveyFrom/SurveyForm";
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

const SurveyPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Survey">
      <BookingServiceForm />
      <Subscribe />
    </PublicLayout>
  );
};

export default SurveyPage;
