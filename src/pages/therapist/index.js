import { useRouter } from "next/router";
import { useEffect } from "react";
import { getCookie } from "cookies-next";

const TherapistIndexPage = () => {
  const router = useRouter();
  const token = getCookie("token");
  const userRole = getCookie("userRole");

  useEffect(() => {
    // Redirect to dashboard if authenticated as therapist
    if (token && userRole === "therapist") {
      router.push("/therapist/dashboard");
    } else {
      // Redirect to login if not authenticated
      router.push("/therapist-login");
    }
  }, [router, token, userRole]);

  // This page will not be displayed as it immediately redirects
  return null;
};

export default TherapistIndexPage; 