import { useEffect } from "react";
import { useRouter } from "next/router";
import { getCookie, deleteCookie } from "cookies-next";

const PAGE_ACCESS = {
  "/admin/dashboard": ["ADMIN", "STAFF"],
  "/admin/customers": ["ADMIN", "STAFF"],
  "/admin/bookings": ["ADMIN", "STAFF"],
  "/admin/schedules": ["ADMIN", "STAFF", "THERAPIST"],
  "/admin/therapists": ["ADMIN"],
  "/admin/staffs": ["ADMIN"],
  "/admin/services": ["ADMIN"],
  "/admin/settings": ["ADMIN"],
  "/admin/feedback": ["THERAPIST"],
  "/admin/profile": ["ADMIN", "STAFF", "THERAPIST"],
  "/admin/therapist-schedule": ["THERAPIST"],
};

export const AuthGuard = ({ children }) => {
  const router = useRouter();
  const token = getCookie("token");
  const userRole = getCookie("userRole");

  useEffect(() => {
    const isAdminPath = router.pathname.startsWith("/admin");

    if (isAdminPath && !token) {
      router.push("/login");
      return;
    }

    if (token && !userRole) {
      deleteCookie("token");
      router.push("/login");
      return;
    }

    if (isAdminPath) {
      const allowedRoles = PAGE_ACCESS[router.pathname];

      if (!allowedRoles || !allowedRoles.includes(userRole)) {
        const firstAllowedPage = Object.entries(PAGE_ACCESS).find(
          ([_, roles]) => roles.includes(userRole)
        )?.[0];

        if (firstAllowedPage) {
          router.push(firstAllowedPage);
        } else {
          deleteCookie("token");
          deleteCookie("userRole");
          router.push("/login");
        }
      }
    }
  }, [router.pathname, token, userRole]);

  return <>{children}</>;
};
