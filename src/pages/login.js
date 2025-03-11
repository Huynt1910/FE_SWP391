import { Login } from "@components/Login/Login";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { showToast } from "@/utils/toast";
import { deleteCookie } from "cookies-next";

const breadcrumbsData = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Customer Log In",
    path: "/login",
  },
];

const LoginPage = () => {
  const router = useRouter();
  const { returnUrl } = router.query;
  
  useEffect(() => {
    console.log("Customer login page mounted");
    // Clear any existing auth tokens to prevent redirect loops
    deleteCookie("token");
    deleteCookie("userRole");
  }, []);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Your login logic here
      // ...
      
      // On successful login:
      localStorage.setItem('authToken', 'your-auth-token'); // Store the token
      localStorage.setItem('userRole', 'customer'); // Store the role
      
      showToast.success('Login successful!');
      
      // Redirect back to the original page or to home
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/');
      }
    } catch (error) {
      showToast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Customer Log In">
      <Login />
      <Subscribe />
    </PublicLayout>
  );
};

export default LoginPage;
