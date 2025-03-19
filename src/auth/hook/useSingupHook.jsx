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
      try {
        const response = await APIClient.invoke({
          action: ACTIONS.SIGN_UP,
          data: params,
        });

        if (!response.success) {
          // Check for specific error messages and return them instead of throwing
          if (response.message) {
            return {
              success: false,
              error: response.message,
              field: response.message.toLowerCase().includes("username")
                ? "username"
                : response.message.toLowerCase().includes("email")
                ? "email"
                : null,
            };
          } else if (response.errors && Array.isArray(response.errors)) {
            // Join multiple validation errors
            return {
              success: false,
              error: response.errors.join(", "),
              field: null,
            };
          } else {
            return {
              success: false,
              error: "Registration failed. Please try again.",
              field: null,
            };
          }
        }

        return { success: true, result: response.result };
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Registration error:", error);
        return {
          success: false,
          error: "Network error. Please check your connection and try again.",
          field: null,
        };
      }
    },
    onSuccess: (response) => {
      if (response.success) {
        setCookie("user", JSON.stringify(response.result)); // Store the result in a cookie

        showToast(
          "Successfully signed up! Please check your email to verify your account.",
          "success"
        );

        router.push("/login"); // Navigate to login page on success
      }
    },
  });

  return { signUp, isPending };
}
