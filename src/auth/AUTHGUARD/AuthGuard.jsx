import { useSelf } from "@/store/self.store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { isAuthenticated, getUserRole, redirectToLogin } from "@/utils/auth";

export const AuthGuard = ({ children, requiredRole }) => {
  const router = useRouter();
  const { self, error } = useSelf();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();
  
  console.log("AuthGuard checking authentication:", authenticated ? "Authenticated" : "Not authenticated");
  console.log("AuthGuard checking role:", userRole);
  console.log("AuthGuard required role:", requiredRole);

  useEffect(() => {
    // Check if authenticated
    if (!authenticated) {
      console.log("Not authenticated, redirecting to login");
      redirectToLogin();
      return;
    }
    
    // Check if there was an authentication error
    if (error) {
      console.error("Authentication error:", error);
      redirectToLogin("Authentication error. Please log in again.");
      return;
    }

    // Check if user data exists
    if (!self) {
      console.log("No user data found, may be loading or error");
      return;
    }
    
    // Admin can access everything
    if (userRole === 'admin') {
      return;
    }

    // Handle admin routes - only admin, staff and therapists can access
    if (requiredRole === 'admin' && userRole !== 'admin' && userRole !== 'staff' && userRole !== 'therapist') {
      router.push("/");
      return;
    }

    // Handle therapist routes - only therapists and admins can access
    if (requiredRole === 'therapist' && userRole !== 'therapist' && userRole !== 'admin') {
      if (userRole === 'staff') {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
      return;
    }

    // For other specific role requirements
    if (requiredRole && requiredRole !== 'admin' && requiredRole !== 'therapist' && userRole !== requiredRole) {
      if (userRole === 'admin' || userRole === 'staff' || userRole === 'therapist') {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [self, router, requiredRole, userRole, authenticated, error]);

  // Show loading or redirect if not authenticated or authentication error
  if (!authenticated || error) {
    return null;
  }
  
  // Show loading while fetching user data
  if (!self) {
    return null;
  }
  
  // Admin can access everything
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // Handle admin routes - only admin, staff and therapists can access
  if (requiredRole === 'admin' && userRole !== 'admin' && userRole !== 'staff' && userRole !== 'therapist') {
    return null;
  }

  // Handle therapist routes - only therapists and admins can access
  if (requiredRole === 'therapist' && userRole !== 'therapist' && userRole !== 'admin') {
    return null;
  }

  // For other specific role requirements
  if (requiredRole && requiredRole !== 'admin' && requiredRole !== 'therapist' && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};