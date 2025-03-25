import { Login } from "@components/Login/Login";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
    console.log("Login page mounted, checking for returnUrl:", returnUrl);
    // We don't automatically clear tokens anymore as this could interfere with authentication
  }, [returnUrl]);

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Log In">
      <Login />
      {/* <Subscribe /> */}
    </PublicLayout>
  );
};

export default LoginPage;
