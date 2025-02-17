import React, { createContext, useState, useEffect } from "react";
import Error from "next/error";
import "../styles/styles.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { AuthGuard } from "@/auth/AUTHGUARD/AuthGuard";
import { protectedRoutes } from "@/auth/AUTHGUARD/protectedRoute";

const MyApp = ({ Component, pageProps }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
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
  return (
    <QueryClientProvider client={queryClient}>
      <CartContext.Provider value={{ cart, setCart }}>
        {protectedRoutes.includes(router.pathname) ? (
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

export const CartContext = createContext();
export default MyApp;
