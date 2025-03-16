import React, { createContext, useState, useEffect } from "react";
import Error from "next/error";
import "../styles/styles.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
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
  const requiresAuth = protectedRoutes.includes(router.pathname);
  const authenticated = isAuthenticated();
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartContext.Provider value={{ cart, setCart }}>
        {requiresAuth ? (
          <AuthGuard>
            <Component {...pageProps} />
          </AuthGuard>
        ) : (
          <Component {...pageProps} />
        )}
        <ToastContainer />
      </CartContext.Provider>
    </QueryClientProvider>
  );
};

export default MyApp;
