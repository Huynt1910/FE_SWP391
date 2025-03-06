import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";

export function useForgotPassword() {
  const { mutateAsync: forgotPassword, isPending } = useMutation({
    mutationFn: async (params) => {
      const { result } = await APIClient.invoke({
        action: ACTIONS.FORGOT_PASSWORD,
        data: params,
      });

      if (result.success) {
        showToast.success("Password reset link sent to your email");
      } else {
        showToast.error("Password reset failed");
      }
    },
  });

  return { forgotPassword, isPending };
}
