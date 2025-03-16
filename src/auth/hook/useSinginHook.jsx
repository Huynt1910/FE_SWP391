import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";
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
          // Extract token from response
          // Check different possible locations for the token
          let token = null;
          let userRole = "customer"; // Default role
          
          // Case 1: Token and role directly in result object
          if (response.result && response.result.token && response.result.role) {
            token = response.result.token;
            userRole = response.result.role.toLowerCase(); // Convert to lowercase for consistency
            console.log("Found token and role in result object:", { token: "Found", role: userRole });
          } 
          // Case 2: Token in result, roles in user object
          else if (response.result && response.result.token && response.result.user && response.result.user.role) {
            token = response.result.token;
            userRole = response.result.user.role.toLowerCase();
            console.log("Found token in result, role in user object:", { token: "Found", role: userRole });
          }
          // Case 3: Token and user in result
          else if (response.result && response.result.token && response.result.user) {
            token = response.result.token;
            userRole = "customer"; // Default to customer if no role specified
            console.log("Found token in result, no role specified:", { token: "Found", role: userRole });
          }
          // Case 4: Token directly in result (string)
          else if (response.result && typeof response.result === 'string') {
            token = response.result;
            userRole = "customer"; // Default to customer if no role specified
            console.log("Found token as string in result:", { token: "Found", role: userRole });
          }
          
          if (token) {
            // Store token and role in cookies
            setAuthData(token, userRole);
            
            showToast.success("Login successful!");
            
            // Redirect based on role
            if (userRole === "admin" || userRole === "staff" || userRole === "therapist") {
              router.push("/admin/dashboard");
            } else {
              router.push("/");
            }
            
            return { success: true };
          } else {
            console.error("No token found in response:", response);
            showToast.error("Login failed: No authentication token received");
            return { success: false, error: "No authentication token received" };
          }
        } else {
          const errorMessage = response?.message || "Login failed. Please check your credentials.";
          showToast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error("Login error:", error);
        showToast.error("An error occurred during login. Please try again.");
      }
    },
  });

  return { signIn, isPending };
}
