import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

export const AuthGuard = ({ children }) => {
  const router = useRouter();
  const token = getCookie("token");
  const userRole = getCookie("userRole");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    // Check for admin routes
    if (router.pathname.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        router.push("/unauthorized");
      }
    }
  }, [token, userRole, router]);

  // Don't render anything while checking authentication
  if (
    !token ||
    (router.pathname.startsWith("/admin") && userRole !== "ADMIN")
  ) {
    return null;
  }

  return <>{children}</>;
};
