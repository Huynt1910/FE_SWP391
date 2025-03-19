import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { setAuthData } from "@/utils/auth";
import { showToast } from "@/utils/toast";

export function useSignIn() {
  const router = useRouter();

  const { mutateAsync: signIn, isPending } = useMutation({
    mutationFn: async (params) => {
      try {
        // Step 1: Login and get token
        const loginResponse = await APIClient.invoke({
          action: ACTIONS.SIGN_IN,
          data: params,
        });

        console.log("Login response:", loginResponse); 

        if (loginResponse && loginResponse.success === true) {
          // Extract token from response
          // Check different possible locations for the token
          let token = null;
          let userRole = "customer"; // Default role
          
          // Case 1: Token and role directly in result object
          if (loginResponse.result && loginResponse.result.token && loginResponse.result.role) {
            token = loginResponse.result.token;
            userRole = loginResponse.result.role.toLowerCase(); // Convert to lowercase for consistency
            console.log("Found token and role in result object:", { token: "Found", role: userRole });
          } 
          // Case 2: Token in result, roles in user object
          else if (loginResponse.result && loginResponse.result.token && loginResponse.result.user && loginResponse.result.user.role) {
            token = loginResponse.result.token;
            userRole = loginResponse.result.user.role.toLowerCase();
            console.log("Found token in result, role in user object:", { token: "Found", role: userRole });
          }
          // Case 3: Token and user in result
          else if (loginResponse.result && loginResponse.result.token && loginResponse.result.user) {
            token = loginResponse.result.token;
            userRole = "customer"; // Default to customer if no role specified
            console.log("Found token in result, no role specified:", { token: "Found", role: userRole });
          }
          // Case 4: Token directly in result (string)
          else if (loginResponse.result && typeof loginResponse.result === 'string') {
            token = loginResponse.result;
            userRole = "customer"; // Default to customer if no role specified
            console.log("Found token as string in result:", { token: "Found", role: userRole });
          }
          
          if (token) {
            // Store token and role in cookies
            setAuthData(token, userRole);
            
            // After setting auth, fetch user info to get ID
            try {
              const userInfoResponse = await APIClient.invoke({
                action: ACTIONS.MY_INFO,
                options: { secure: true }
              });
              
              console.log("User info response:", userInfoResponse);
              
              if (userInfoResponse && userInfoResponse.success && userInfoResponse.result && userInfoResponse.result.id) {
                // Store user ID in cookies
                const userId = userInfoResponse.result.id;
                document.cookie = `userId=${userId}; path=/; max-age=86400`;
                console.log("Stored user ID in cookies:", userId);
                
                // Also store in localStorage for backup
                localStorage.setItem('userId', userId);
                
                // Store full user object in localStorage
                localStorage.setItem('user', JSON.stringify(userInfoResponse.result));
              }
            } catch (error) {
              console.error("Error fetching user info:", error);
            }
            
            showToast.success("Login successful!");
            
            // Redirect based on role
            if (userRole === "admin" || userRole === "staff" || userRole === "therapist") {
              router.push("/admin/dashboard");
            } else {
              router.push("/");
            }
            
            return { success: true };
          } else {
            console.error("No token found in response:", loginResponse);
            showToast.error("Login failed: No authentication token received");
            return { success: false, error: "No authentication token received" };
          }
        } else {
          const errorMessage = loginResponse?.message || "Login failed. Please check your credentials.";
          showToast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      } catch (error) {
        console.error("Login error:", error);
        const errorMessage = error?.response?.message || error.message || "An error occurred during login.";
        showToast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
  });

  return {
    signIn,
    isPending,
  };
}
