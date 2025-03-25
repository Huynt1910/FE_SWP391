import SurveyForm from "@/components/SurveyFrom/SurveyForm";
import { PublicLayout } from "@/layout/PublicLayout";

import { Subscribe } from "@components/shared/Subscribe/Subscribe";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Survey",
    path: "/survey",
  },
];

const SurveyPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Survey">
      <SurveyForm />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default SurveyPage;
