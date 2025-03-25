
import TherapistList from "@/components/Therapists/TherapistList";
import { PublicLayout } from "@/layout/PublicLayout";

import { Subscribe } from "@components/shared/Subscribe/Subscribe";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Therapists",
    path: "/therapists",
  },
];

const TherapistsPage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Therapists">
      <TherapistList />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default TherapistsPage;
