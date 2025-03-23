import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { setAuthData, getToken } from "@/utils/auth";

export function useSignIn() {
  const mutation = useMutation({
    mutationFn: async (credentials) => {
      console.log("Sending login request:", credentials); // Debug log

      const response = await APIClient.invoke({
        action: ACTIONS.SIGN_IN,
        data: credentials,
      });

      console.log("Raw API response:", response); // Debug log

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      // Store the authentication token first
      if (response.result && response.result.token) {
        // Save token and user role in cookies
        const token = response.result.token;
        const userRole = response.result.role || "customer";
        setAuthData(token, userRole);
        console.log("Authentication token stored");
      }

      // Now fetch user info with the token set
      try {
        // Get the token that was just set
        const token = getToken();

        if (!token) {
          console.error("No token available for user info request");
          return response;
        }

        // Add the Authorization header explicitly
        const userInfoResponse = await APIClient.invoke({
          action: ACTIONS.MY_INFO,
          options: { secure: true },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("User info response:", userInfoResponse);

        if (
          userInfoResponse &&
          userInfoResponse.success &&
          userInfoResponse.result &&
          userInfoResponse.result.id
        ) {
          // Store only user ID in cookies
          const userId = userInfoResponse.result.id;
          document.cookie = `userId=${userId}; path=/; max-age=86400`;
          console.log("Stored user ID in cookies:", userId);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }

      showToast("Login successful!", "success");
      return response;
    },
  });

  return {
    signIn: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
