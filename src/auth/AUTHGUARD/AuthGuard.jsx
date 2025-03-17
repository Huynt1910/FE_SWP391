import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAuthenticated, getUserRole, redirectToLogin } from "@/utils/auth";
import { useSelf } from "@/store/self.store";

export const SystemAuthGuard = ({ children }) => {
  const router = useRouter();
  const { self, error } = useSelf();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  console.log(
    "AuthGuard checking authentication:",
    authenticated ? "Authenticated" : "Not authenticated"
  );
  console.log("AuthGuard checking role:", userRole);
  console.log("AuthGuard required role:", requiredRole || "none");

  useEffect(() => {
    if (!token || userRole !== "admin") {
      router.push("/login");
    }
  }, [token, userRole, router]);

  if (!token || userRole !== "admin") {
    return null;
  }

  return <>{children}</>;
};
