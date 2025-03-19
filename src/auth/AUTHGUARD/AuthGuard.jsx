import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

export const AuthGuard = ({ children, requiredRole }) => {
  const router = useRouter();
  const token = getCookie("token");
  const userRole = getCookie("userRole");

  useEffect(() => {
    if (!authenticated) {
      redirectToLogin();
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      console.log("Unauthorized role. Redirecting to home...");
      router.push("/");
    }
  }, [authenticated, userRole, requiredRole, router]);

  // Show nothing while checking authentication
  if (!authenticated || (requiredRole && userRole !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
};

// Export the SystemAuthGuard as well if it's needed elsewhere
export const SystemAuthGuard = ({ children }) => {
  const router = useRouter();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  useEffect(() => {
    if (!authenticated || userRole !== "admin") {
      router.push("/login");
      return;
    }

    // Check for admin routes
    if (router.pathname.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        router.push("/unauthorized");
      }
    }
  }, [authenticated, userRole, router]);

  if (!authenticated || userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
};
