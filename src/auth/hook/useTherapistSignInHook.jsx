import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";

export function useTherapistSignIn() {
  const router = useRouter();

  const { mutateAsync: therapistSignIn, isPending } = useMutation({
    mutationFn: async (params) => {
      try {
        console.log("Attempting therapist login with:", params);
        const { result } = await APIClient.invoke({
          action: ACTIONS.THERAPIST_SIGN_IN,
          data: params,
        });

        console.log("Therapist login result:", result);

        if (result && result.success == true) {
          const { token } = result;

          // Set cookies
          setCookie("token", token);
          setCookie("userRole", "therapist");
          
          showToast.success("Successfully signed in as therapist!");
          
          // Use window.location for more reliable navigation
          console.log("Redirecting to therapist dashboard");
          setTimeout(() => {
            window.location.href = "/therapist/dashboard";
          }, 500);
        } else {
          showToast.error("Invalid therapist credentials!");
        }
      } catch (error) {
        console.error("Therapist login error:", error);
        showToast.error("An error occurred during login. Please try again.");
      }
    },
  });

  return { therapistSignIn, isPending };
} 