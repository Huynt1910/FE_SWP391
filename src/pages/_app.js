import React, { useState, useEffect } from "react";
import Error from "next/error";
import "../styles/styles.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import { protectedRoutes } from "@/auth/AUTHGUARD/protectedRoute";
import { isAuthenticated, handleAuthError } from "@/utils/auth";
import { CartProvider } from "@/context/CartContext";

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
  const requiresAuth = protectedRoutes.includes(router.pathname);
  const authenticated = isAuthenticated();
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {requiresAuth ? (
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        ) : (
          <Component {...pageProps} />
        )}
        <ToastContainer />
      </CartProvider>
    </QueryClientProvider>
  );
};

export default MyApp;