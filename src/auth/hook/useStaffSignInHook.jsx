import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";

export function useStaffSignIn() {
  const router = useRouter();

  const { mutateAsync: staffSignIn, isPending } = useMutation({
    mutationFn: async (params) => {
      try {
        console.log("Attempting staff login with:", params);
        const { result } = await APIClient.invoke({
          action: ACTIONS.STAFF_SIGN_IN,
          data: params,
        });

        console.log("Staff login result:", result);

        if (result && result.success == true) {
          const { token } = result;

          // Set cookies
          setCookie("token", token);
          setCookie("userRole", "staff");
          
          showToast.success("Successfully signed in as staff!");
          
          // Use window.location for more reliable navigation
          console.log("Redirecting to staff dashboard");
          setTimeout(() => {
            window.location.href = "/admin/dashboard";
          }, 500);
        } else {
          showToast.error("Invalid staff credentials!");
        }
      } catch (error) {
        console.error("Staff login error:", error);
        showToast.error("An error occurred during login. Please try again.");
      }
    },
  });

  return { staffSignIn, isPending };
} 