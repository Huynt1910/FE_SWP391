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
          
          // Case 1: Token and role directly in result object (admin login)
          if (response.result && response.result.token && response.result.role) {
            token = response.result.token;
            userRole = response.result.role.toLowerCase(); // Convert to lowercase for consistency
            console.log("Found token and role in result object:", { token: "Found", role: userRole });
          } 
          // Case 2: Token in result, roles in user object (previous structure)
          else if (response.result && response.result.token) {
            token = response.result.token;
            
            // Check if user has roles array
            if (response.result && response.result.roles && Array.isArray(response.result.roles) && response.result.roles.length > 0) {
              // Check for ADMIN role first
              for (const role of response.result.roles) {
                if (role.name && role.name.toUpperCase() === "ADMIN") {
                  userRole = "admin";
                  break;
                }
              }
              
              // If not admin, check for other roles
              if (userRole === "customer") {
                for (const role of response.result.roles) {
                  if (role.name && role.name.toUpperCase() === "STAFF") {
                    userRole = "staff";
                    break;
                  } else if (role.name && role.name.toUpperCase() === "THERAPIST") {
                    userRole = "therapist";
                    break;
                  }
                }
              }
            }
          }
          // Case 3: Token directly in response
          else if (response.token) {
            token = response.token;
          }
          
          if (!token) {
            console.warn("No token found in response");
            showToast.error("Authentication error. Please try again.");
            return;
          }

          console.log("Final determined user role:", userRole);

          // Set cookies
          setCookie("token", token);
          setCookie("userRole", userRole);
          
          // Show success message based on role
          if (userRole === "admin" || userRole === "staff" || userRole === "therapist") {
            showToast.success(`Successfully signed in as ${userRole}!`);
            
            // Redirect to admin dashboard
            console.log("Redirecting to admin dashboard");
            setTimeout(() => {
              window.location.href = "/admin/dashboard";
            }, 500);
          } else {
            showToast.success("Successfully signed in!");
            
            // Redirect to home page
            console.log("Redirecting to home page");
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          }
        } else {
          showToast.error("Invalid credentials!");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
  });

  return { signIn, isPending };
}
