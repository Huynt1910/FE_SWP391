import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";

export function useSignUp() {
  const router = useRouter();

  const { mutateAsync: signUp, isLoading: isPending } = useMutation({
    mutationFn: async (params) => {
      return await APIClient.invoke({
        action: ACTIONS.SIGN_UP,
        data: params,
      });
    },
    onSuccess: (response) => {
      if (response && response.success && response?.result) {
        const { result } = response;
        setCookie("user", JSON.stringify(result)); // Store the result in a cookie

        showToast.success(
          "Successfully signed up! Please check your email to verify your account."
        );

        router.push("/login"); // Navigate to login page on success
      } else {
        showToast.error("Sign-up failed! Please try again.");
      }
    },
  });

  return { signUp, isPending };
}
