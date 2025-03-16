import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

export const SystemAuthGuard = ({ children }) => {
  const router = useRouter();
  const token = getCookie("token");
  const userRole = getCookie("userRole");
  
  console.log("AuthGuard checking role:", userRole);
  console.log("AuthGuard required role:", requiredRole);

  useEffect(() => {
    if (!self) {
      router.push("/login");
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
  }, [token, userRole, router]);

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
