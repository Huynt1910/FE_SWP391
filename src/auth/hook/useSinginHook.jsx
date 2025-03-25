import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { setAuthData, getToken } from "@/utils/auth";


export function useSignIn() {
  const mutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        console.log("Sending login request:", { 
          username: credentials.username,
          password: "********" // Hide password in logs
        });

        const response = await APIClient.invoke({
          action: ACTIONS.SIGN_IN,
          data: credentials,
          options: {
            preventRedirect: true,
            publicAccess: true
          }
        });

        console.log("Raw API response:", {
          success: response.success,
          hasResult: !!response.result,
          message: response.message
        });

        if (!response.success) {
          // Show toast message instead of throwing error
          showToast(response.message || "Wrong username or password", "error");
          return { success: false, errorType: "api_response", message: response.message };
        }

        // Store the authentication token first
        if (response.result && response.result.token) {
          // Save token and user role in cookies
          const token = response.result.token;
          const userRole = response.result.role || "customer";
          setAuthData(token, userRole);
          console.log("Authentication token stored");
        }

        // Now fetch user info with the token set, but only if the role is CUSTOMER
        try {
          const userRole = response.result?.role?.toUpperCase();
          
          // Only proceed with fetching user info if the role is CUSTOMER
          if (userRole === "CUSTOMER") {
            console.log("User is a CUSTOMER, fetching user info");
            
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
          } else {
            console.log(`User is a ${userRole}, skipping user info fetch and userId storage`);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }

        showToast("Login successful!", "success");
        return response;
      } catch (error) {
        console.error("Login error caught:", error);
        
        // Handle specific error status codes with appropriate toast messages
        if (error.response) {
          const status = error.response.status;
          
          if (status === 404) {
            // Account doesn't exist
            showToast("Account doesn't exist", "error");
            return { 
              success: false, 
              errorType: "not_found", 
              message: "Account doesn't exist",
              status: 404 
            };
          } else if (status === 401) {
            // Incorrect password
            showToast("Incorrect password", "error");
            return { 
              success: false, 
              errorType: "unauthorized", 
              message: "Incorrect password",
              status: 401 
            };
          } else if (status === 400) {
            // Bad request
            showToast(error.response.data?.message || "Invalid login details", "error");
            return { 
              success: false, 
              errorType: "bad_request", 
              message: error.response.data?.message || "Invalid login details",
              status: 400 
            };
          }
        }
        
        // Generic error fallback
        showToast("Login failed. Please try again later.", "error");
        return { 
          success: false, 
          errorType: "unknown", 
          message: error.message || "Login failed"
        };
      }
    },
  });

  return {
    signIn: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
