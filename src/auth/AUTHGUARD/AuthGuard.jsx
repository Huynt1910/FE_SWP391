import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

export const SystemAuthGuard = ({ children }) => {
  const router = useRouter();
  const token = getCookie("token");
  const userRole = getCookie("userRole");

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
