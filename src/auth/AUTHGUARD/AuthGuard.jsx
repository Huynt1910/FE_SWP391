import { useSelf } from "@/store/self.store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

export const AuthGuard = ({ children, requiredRole }) => {
  const router = useRouter();
  const { self } = useSelf();
  const userRole = getCookie("userRole");

  useEffect(() => {
    if (!self) {
      router.push("/login-selection");
      return;
    }

    // If a specific role is required and user doesn't have it
    if (requiredRole && userRole !== requiredRole) {
      if (userRole === 'staff') {
        router.push("/admin/dashboard");
      } else if (userRole === 'therapist') {
        router.push("/therapist/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [self, router, requiredRole, userRole]);

  if (!self) {
    return null;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
