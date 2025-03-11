import { StaffLogin } from "@components/Login/StaffLogin";
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
    label: "Staff Log In",
    path: "/staff-login",
  },
];

const StaffLoginPage = () => {
  useEffect(() => {
    console.log("Staff login page mounted");
    // Clear any existing auth tokens to prevent redirect loops
    deleteCookie("token");
    deleteCookie("userRole");
  }, []);

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Staff Log In">
      <StaffLogin />
      <Subscribe />
    </PublicLayout>
  );
};

export default StaffLoginPage; 