import { LoginSelection } from "@components/Login/LoginSelection";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";
import { useEffect } from "react";
import { deleteCookie } from "cookies-next";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Login Selection",
    path: "/login-selection",
  },
];

const LoginSelectionPage = () => {
  useEffect(() => {
    console.log("Login selection page mounted");
    // Clear any existing auth tokens to prevent redirect loops
    deleteCookie("token");
    deleteCookie("userRole");
  }, []);

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Choose Your Role">
      <LoginSelection />
      <Subscribe />
    </PublicLayout>
  );
};

export default LoginSelectionPage; 