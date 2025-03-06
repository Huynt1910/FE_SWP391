import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";
import ForgotPasswordForm from "@/components/ForgotPassword/ForgotPassword";

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
      <ForgotPasswordForm />
      <Subscribe />
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
