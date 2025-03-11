import { ForgotPassword } from "@components/ForgotPassword/ForgotPassword";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Forgot Password",
    path: "/forgot-password",
  },
];

const ForgotPasswordPage = () => {
  return (
    <PublicLayout
      breadcrumb={breadcrumbsData}
      breadcrumbTitle="Forgot Password"
    >
      <ForgotPassword />
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
