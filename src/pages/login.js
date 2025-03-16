import { Login } from "@components/Login/Login";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { deleteCookie } from "cookies-next";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Log In",
    path: "/login",
  },
];

const LoginPage = () => {
  const router = useRouter();
  const { returnUrl } = router.query;
  
  useEffect(() => {
    console.log("Unified login page mounted");
    // Clear any existing auth tokens to prevent redirect loops
    deleteCookie("token");
    deleteCookie("userRole");
  }, []);

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Log In">
      <Login />
      <Subscribe />
    </PublicLayout>
  );
};

export default LoginPage;
