import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";

export function useForgotPassword() {
  // Step 1: Verify Email
  const { mutateAsync: verifyEmail, isPending: isVerifyingEmail } = useMutation({
    mutationFn: async (email) => {
      try {
        console.log("Verifying email:", email);
        
        const response = await APIClient.invoke({
          action: ACTIONS.VERIFY_EMAIL,
          pathParams: { email },
          options: { 
            preventRedirect: true,
            publicAccess: true
          }
        });

        console.log("Email verification response:", response);

        if (response.success) {
          showToast("OTP sent to your email", "success");
          return { success: true, email };
        } else {
          showToast(response.message || "Failed to send OTP", "error");
          return { success: false };
        }
      } catch (error) {
        console.error("Verify email error:", error);
        showToast("Failed to send OTP. Please try again.", "error");
        return { success: false };
      }
    },
  });

  // Step 2: Verify OTP
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: async ({ email, otp }) => {
      try {
        console.log("Verifying OTP:", { email, otp });
        
        const response = await APIClient.invoke({
          action: ACTIONS.VERIFY_OTP,
          pathParams: { email, otp },
          options: { 
            preventRedirect: true,
            publicAccess: true
          }
        });

        console.log("OTP verification response:", response);

        if (response.success) {
          showToast("OTP verified successfully", "success");
          return { success: true, email };
        } else {
          showToast(response.message || "Invalid OTP", "error");
          return { success: false };
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        showToast("Failed to verify OTP. Please try again.", "error");
        return { success: false };
      }
    },
  });

  // Step 3: Change Password
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: async ({ email, password, repassword }) => {
      try {
        console.log("Changing password for email:", email);
        
        const response = await APIClient.invoke({
          action: ACTIONS.CHANGE_FORGOT_PASSWORD,
          pathParams: { email },
          data: { password, repassword },
          options: { 
            preventRedirect: true,
            publicAccess: true
          }
        });

        console.log("Password change response:", response);

        if (response.success) {
          // showToast("Password changed successfully", "success");
          return { success: true };
        } else {
          showToast(response.message || "Failed to change password", "error");
          return { success: false };
        }
      } catch (error) {
        console.error("Change password error:", error);
        showToast("Failed to change password. Please try again.", "error");
        return { success: false };
      }
    },
  });

  return { 
    verifyEmail, 
    isVerifyingEmail, 
    verifyOtp, 
    isVerifyingOtp, 
    changePassword, 
    isChangingPassword 
  };
}