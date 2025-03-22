import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/router";
import { setAuthData } from "@/utils/auth";

export function useSignIn() {
  const router = useRouter();

  const { mutateAsync: signIn, isPending } = useMutation({
    mutationFn: async (params) => {
      try {
        console.log("Attempting login with:", params);
        const response = await APIClient.invoke({
          action: ACTIONS.SIGN_IN,
          data: params,
        });

        console.log("Login response:", response);

        if (response && response.success === true) {
          let token = null;
          let userRole = "customer"; // Default role
          let userId = null;
          
          // Case 1: Token, role and userId in result object
          if (response.result && response.result.token && response.result.role) {
            token = response.result.token;
            userRole = response.result.role.toLowerCase();
            userId = response.result.userId || response.result.id;
            console.log("Found token, role and userId in result object:", { token: "Found", role: userRole, userId });
          } 
          // Case 2: Token in result, roles and userId in user object
          else if (response.result && response.result.token && response.result.user) {
            token = response.result.token;
            userRole = response.result.user.role?.toLowerCase() || "customer";
            userId = response.result.user.id || response.result.user.userId;
            console.log("Found token in result, role and userId in user object:", { token: "Found", role: userRole, userId });
          }
          // Case 3: Token directly in result (string)
          else if (response.result && typeof response.result === 'string') {
            token = response.result;
            console.log("Found token as string in result:", { token: "Found", role: userRole });
          }
          
          if (token) {
            // Store token and role in cookies
            setAuthData(token, userRole);
            
            // If we don't have userId yet, fetch user info
            if (!userId) {
              try {
                const userInfoResponse = await APIClient.invoke({
                  action: ACTIONS.MY_INFO,
                  options: { secure: true }
                });
                
                console.log("User info response:", userInfoResponse);
                
                if (userInfoResponse?.success && userInfoResponse.result?.id) {
                  userId = userInfoResponse.result.id;
                }
              } catch (error) {
                console.error("Error fetching user info:", error);
              }
            }

            // Store userId in cookie if we have it
            if (userId) {
              document.cookie = `userId=${userId}; path=/; max-age=86400`;
              console.log("Stored user ID in cookies:", userId);
            }
            
            showToast("Login successful!", "success");
            
            // Redirect based on role
            if (userRole === "admin" || userRole === "staff" || userRole === "therapist") {
              router.push("/admin/dashboard");
            } else {
              router.push("/");
            }
            
            return { success: true, userId, role: userRole };
          } else {
            console.error("No token found in response:", response);
            showToast("Login failed: No authentication token received", "error");
            return { success: false, error: "No authentication token received" };
          }
        } else {
          const errorMessage = response?.message || "Login failed. Please check your credentials.";
          showToast(errorMessage, "error");
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error.message || "Login failed. Please try again.";
        showToast(errorMessage, "error");
        return { success: false, error: errorMessage };
      }
    },
  });

  return { signIn, isPending };
}