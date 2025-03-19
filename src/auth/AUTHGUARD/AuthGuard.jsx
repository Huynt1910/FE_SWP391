import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAuthenticated, getUserRole, redirectToLogin } from "@/utils/auth";

export const AuthGuard = ({ children, requiredRole }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const userRole = getUserRole();

      console.log(
        "AuthGuard checking authentication:",
        authenticated ? "Authenticated" : "Not authenticated"
      );
      console.log("AuthGuard checking role:", userRole);
      console.log("AuthGuard required role:", requiredRole || "none");

      if (!authenticated) {
        redirectToLogin();
        setIsAuthorized(false);
      } else if (requiredRole && userRole !== requiredRole) {
        console.log("Unauthorized role. Redirecting to home...");
        router.push("/");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, router]);

  // Show nothing while loading or if not authorized
  if (isLoading || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

// Export the SystemAuthGuard as well if it's needed elsewhere
export const SystemAuthGuard = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const userRole = getUserRole();

      if (!authenticated || userRole !== "admin") {
        router.push("/login");
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Show nothing while loading or if not authorized
  if (isLoading || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
