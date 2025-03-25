import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/router";

export function useSignUp() {
  const router = useRouter();

  const { mutateAsync: signUp, isLoading: isPending } = useMutation({
    mutationFn: async (params) => {
      try {
        console.log("Preparing registration data:", {
          ...params,
          password: "************" // Hide password in logs
        });

        // Ensure all required fields are present
        const payload = {
          username: params.username,
          password: params.password,
          email: params.email,
          firstName: params.firstName,
          lastName: params.lastName,
          phone: params.phone || "0000000000",
          address: params.address || "HCM",
          gender: params.gender || "Male",
          birthDate: params.birthDate || "2000-01-01"
        };

        console.log("Sending registration API request with endpoint:", ACTIONS.SIGN_UP);

        const response = await APIClient.invoke({
          action: ACTIONS.SIGN_UP,
          data: payload,
          options: { 
            preventRedirect: true,
            publicAccess: true
          },
        });

        console.log("Registration API response:", {
          success: response.success,
          message: response.message,
          hasResult: !!response.result
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
        // Handle axios errors specifically
        if (error.response) {
          console.error("Registration API error:", {
            status: error.response.status,
            data: error.response.data,
            message: error.message
          });

          // Check for "User already exists" error
          if (error.response.data && error.response.data.error === "User already exists") {
            return {
              success: false,
              error: "Username already exists. Please choose a different username.",
              field: "username"
            };
          }

          // For 401 errors (usually API access issues)
          if (error.response.status === 401) {
            return {
              success: false,
              error: "The registration service is currently unavailable. Please try again later.",
              field: null
            };
          }

          // For validation errors that might come back from the server
          if (error.response.status === 400 || error.response.status === 422) {
            const errorData = error.response.data;
            
            // Check if there's a field-specific error
            const field = Object.keys(errorData.errors || {}).length > 0 
              ? Object.keys(errorData.errors)[0] 
              : null;
              
            return {
              success: false,
              error: errorData.message || "Please check your registration details and try again.",
              field: field
            };
          }
        }

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
        if (response.result) {
          setCookie("user", JSON.stringify(response.result)); // Store the result in a cookie
        }

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
