import React, { createContext, useState, useEffect } from "react";
import Error from "next/error";
import "../styles/styles.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { SystemAuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import { protectedRoutes } from "@/auth/AUTHGUARD/protectedRoute";
import { isAuthenticated, handleAuthError } from "@/utils/auth";

// Create cart context
export const CartContext = createContext();

const MyApp = ({ Component, pageProps }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            onError: (error) => {
              console.error("Query error:", error);
              // Handle authentication errors globally
              handleAuthError(error);
            }
          },
        },
      })
  );
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  
  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pageProps.error) {
    return (
      <Error
        statusCode={pageProps.error.statusCode}
        title={pageProps.error.message}
      />
    );
  }

  if (!mounted) {
    return null;
  }
  
  // Check if current route requires authentication
  const isProtectedRoute = () => {
    // Check if the current path starts with any of the protected routes
    return protectedRoutes.some(route => 
      router.pathname === route || 
      router.pathname.startsWith(`${route}/`)
    );
  };
  
  const requiresAuth = isProtectedRoute();
  const authenticated = isAuthenticated();
  
  console.log("Current path:", router.pathname);
  console.log("Is protected route:", requiresAuth);
  console.log("Is authenticated:", authenticated);
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartContext.Provider value={{ cart, setCart }}>
        {requiresAuth ? (
          <SystemAuthGuard requiredRole={router.pathname.includes('/admin') ? 'admin' : undefined}>
            <Component {...pageProps} />
          </SystemAuthGuard>
        ) : (
          <Component {...pageProps} />
        )}
        <ToastContainer />
      </CartContext.Provider>
    </QueryClientProvider>
  );
};

export default MyApp;
