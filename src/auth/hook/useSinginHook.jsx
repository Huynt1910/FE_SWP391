import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";

export function useSignIn() {
  const router = useRouter();

  const { mutateAsync: signIn, isPending } = useMutation({
    mutationFn: async (params) => {
      try {
        console.log("Attempting customer login with:", params);
        const { result } = await APIClient.invoke({
          action: ACTIONS.SIGN_IN,
          data: params,
        });

        console.log("Customer login result:", result);

        if (result && result.success == true) {
          const { token } = result;

          // Set cookies
          setCookie("token", token);
          setCookie("userRole", "customer");
          
          showToast.success("Successfully signed in!");
          
          // Use window.location for more reliable navigation
          console.log("Redirecting to home page");
          setTimeout(() => {
            window.location.href = "/";
          }, 500);
        } else {
          showToast.error("Invalid credentials!");
        }
      } catch (error) {
        console.error("Login error:", error);
        showToast.error("An error occurred during login. Please try again.");
      }
    },
  });

  return { signIn, isPending };
}
