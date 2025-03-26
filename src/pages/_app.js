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
import { registerNetworkListeners, isOnline } from "@/utils/network";
import { showNetworkErrorToast, showNetworkRestoredToast } from "@/utils/toast";

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
  const [isNetworkOnline, setIsNetworkOnline] = useState(true);
  
  // Handle client-side mounting and set up network listeners
  useEffect(() => {
    setMounted(true);
    
    // Set initial network status
    setIsNetworkOnline(isOnline());
    
    // Register network status change listeners
    const cleanup = registerNetworkListeners(
      // Online callback
      () => {
        console.log("Network connection restored");
        setIsNetworkOnline(true);
        showNetworkRestoredToast();
        
        // Optionally trigger refetch of stale queries
        queryClient.invalidateQueries();
      },
      // Offline callback
      () => {
        console.log("Network connection lost");
        setIsNetworkOnline(false);
        showNetworkErrorToast();
      }
    );
    
    return cleanup;
  }, [queryClient]);

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
  console.log("Network status:", isNetworkOnline ? "Online" : "Offline");
  
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {requiresAuth ? (
          <AuthGuard requiredRole={router.pathname.includes('/admin') ? 'admin' : undefined}>
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