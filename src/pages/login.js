import { Login } from "@components/Login/Login";
import { Subscribe } from "@components/shared/Subscribe/Subscribe";
import { PublicLayout } from "@/layout/PublicLayout";
import { useRouter } from 'next/router';
import { useState } from 'react';
import { showToast } from "@/utils/toast";

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
      
      showToast.success('Login successful!');
      
      // Redirect back to the original page or to home
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/home');
      }
    } catch (error) {
      showToast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout breadcrumb={breadcrumbsData} breadcrumbTitle="Log In">
      <Login />
      <Subscribe />
    </PublicLayout>
  );
};

export default LoginPage;
