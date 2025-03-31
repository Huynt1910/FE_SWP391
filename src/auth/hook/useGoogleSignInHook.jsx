import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "@/utils/firebase";
import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";
import { setAuthData, getToken } from "@/utils/auth";
import { showToast } from "@/utils/toast";

export function useGoogleAuth() {
  const mutation = useMutation({
    mutationFn: async () => {
      try {
        console.log("Attempting Google sign-in");
        
        // Sign in with Google - using the exported function
        const googleResult = await signInWithGoogle()
          .catch(error => {
            console.error("Firebase popup error:", error);
            throw error;
          });
        
        if (!googleResult.success || !googleResult.user) {
          console.error("Google sign-in failed:", googleResult.errorMessage || "Unknown error");
          throw new Error(googleResult.errorMessage || "Google sign-in failed");
        }
        
        console.log("Google sign-in successful, getting user details");
        
        // Get user details from Google
        const user = googleResult.user;
        const { email, uid, name, photoURL } = user;
        
        console.log("User details obtained:", { 
          email, 
          uid, 
          displayName: name || "Not provided" 
        });
        
        // Split the display name into first name and last name
        let firstName = "", lastName = "";
        if (name) {
          const nameParts = name.split(" ");
          if (nameParts.length > 1) {
            lastName = nameParts.pop();
            firstName = nameParts.join(" ");
          } else {
            firstName = name;
          }
        }
        
        try {
          // Get ID token for Firebase authentication
          console.log("Getting ID token from Firebase");
          const idToken = user.idToken || "";
          console.log("ID token obtained:", idToken ? "Token present" : "Token missing");
          
          // Try to call API, but handle "Failed to fetch" gracefully
          console.log("Calling backend authentication API with Google token");
          
          try {
            // Simplify the data structure to match what Postman is sending
            // Based on the Postman screenshot, just send the token in the request body
            const response = await APIClient.invoke({
              action: ACTIONS.SIGN_IN_WITH_GOOGLE,
              data: {
                token: idToken,
                // Include these fields as backup in case the backend needs them
                email: email,
                googleId: uid,
                displayName: name,
                firstName: firstName,
                lastName: lastName,
                photoURL: photoURL
              },
              options: {
                preventRedirect: true,
                publicAccess: true
              },
              headers: {
                "Content-Type": "application/json"
              }
            });
            
            console.log("Backend API response:", response);
            
            if (!response.success) {
              console.error("Backend authentication failed:", response.message);
              showToast(response.message || "Google login failed", "error");
              return { success: false, message: response.message };
            }
            
            // Store the authentication token
            if (response.result && response.result.token) {
              // Save token and user role in cookies
              const token = response.result.token;
              const userRole = response.result.role || "customer";
              console.log("Storing auth data, role:", userRole);
              setAuthData(token, userRole);
            } else {
              console.error("No token in response:", response);
              return { success: false, message: "Invalid token response" };
            }
            
            // Now fetch user info with the token set, but only if the role is CUSTOMER
            try {
              const userRole = response.result?.role?.toUpperCase();
              
              // Only proceed with fetching user info if the role is CUSTOMER
              if (userRole === "CUSTOMER") {
                console.log("User is CUSTOMER, fetching additional user info");
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
                  console.log("User ID stored in cookies:", userId);
                }
              }
            } catch (userInfoError) {
              console.error("Error fetching user info:", userInfoError);
              // Continue anyway with login success - user info is optional
            }
            
            showToast("Google login successful!", "success");
            return response;
            
          } catch (fetchError) {
            // Handle "Failed to fetch" error with a more user-friendly message
            console.error("API request failed:", fetchError);
            showToast("Server connection failed. Please check your internet connection or try again later.", "error");
            return { 
              success: false, 
              message: "Failed to connect to server" 
            };
          }
        } catch (apiError) {
          console.error("API call or token error:", apiError);
          showToast("Error connecting to service. Please try again.", "error");
          return { success: false, message: apiError.message };
        }
      } catch (error) {
        console.error("Google login error:", error.code, error.message);
        
        // Handle Google login errors
        if (error.code === "auth/popup-closed-by-user") {
          showToast("Login cancelled", "error");
          return { success: false, message: "Login cancelled" };
        }
        
        if (error.code === "auth/popup-blocked") {
          showToast("Popup blocked by browser. Please allow popups for this site.", "error");
          return { success: false, message: "Popup blocked" };
        }
        
        if (error.code === "auth/cancelled-popup-request") {
          showToast("Another popup is already open", "error");
          return { success: false, message: "Another popup is already open" };
        }
        
        if (error.code === "auth/network-request-failed") {
          showToast("Network error. Please check your internet connection.", "error");
          return { success: false, message: "Network error" };
        }
        
        // Generic error fallback
        showToast("Google login failed: " + (error.message || "Unknown error"), "error");
        return { success: false, message: error.message || "Google login failed" };
      }
    },
  });

  return {
    googleSignIn: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
} 