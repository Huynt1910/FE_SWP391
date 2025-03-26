import { PublicLayout } from "@/layout/PublicLayout";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { Service } from "@components/Service/Service";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Services",
    path: "/service",
  },
];

const ServicePage = () => {
  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Our Services">
      <Service />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default ServicePage; 