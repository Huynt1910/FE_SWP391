import { TherapistLogin } from "@components/Login/TherapistLogin";
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
    label: "Therapist Log In",
    path: "/therapist-login",
  },
];

const TherapistLoginPage = () => {
  useEffect(() => {
    console.log("Therapist login page mounted");
    // Clear any existing auth tokens to prevent redirect loops
    deleteCookie("token");
    deleteCookie("userRole");
  }, []);

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Therapist Log In">
      <TherapistLogin />
      <Subscribe />
    </PublicLayout>
  );
};

export default TherapistLoginPage; 