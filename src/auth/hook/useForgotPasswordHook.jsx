import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";

export function useForgotPassword() {
  // Step 1: Verify Email
  const { mutateAsync: verifyEmail, isPending: isVerifyingEmail } = useMutation({
    mutationFn: async (email) => {
      try {
        const response = await APIClient.invoke({
          action: ACTIONS.VERIFY_EMAIL,
          data: { email }
        });

        if (response.success) {
          showToast.success("OTP sent to your email");
          return { success: true, email };
        } else {
          showToast.error(response.message || "Failed to send OTP");
          return { success: false };
        }
      } catch (error) {
        console.error("Verify email error:", error);
        showToast.error("Failed to send OTP. Please try again.");
        return { success: false };
      }
    },
  });

  // Step 2: Verify OTP
  const { mutateAsync: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: async ({ email, otp }) => {
      try {
        const response = await APIClient.invoke({
          action: ACTIONS.VERIFY_OTP,
          data: { email, otp }
        });

        if (response.success) {
          showToast.success("OTP verified successfully");
          return { success: true, email };
        } else {
          showToast.error(response.message || "Invalid OTP");
          return { success: false };
        }
      } catch (error) {
        console.error("Verify OTP error:", error);
        showToast.error("Failed to verify OTP. Please try again.");
        return { success: false };
      }
    },
  });

  // Step 3: Change Password
  const { mutateAsync: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: async ({ email, password, repassword }) => {
      try {
        const response = await APIClient.invoke({
          action: ACTIONS.CHANGE_FORGOT_PASSWORD,
          data: { email, password, repassword }
        });

        if (response.success) {
          showToast.success("Password changed successfully");
          return { success: true };
        } else {
          showToast.error(response.message || "Failed to change password");
          return { success: false };
        }
      } catch (error) {
        console.error("Change password error:", error);
        showToast.error("Failed to change password. Please try again.");
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