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
        const { result } = await APIClient.invoke({
          action: ACTIONS.SIGN_IN,
          data: params,
        });

        if (result && result.success) {
          const { token, role } = result;

          // Let the Login component handle redirects and cookies
          return { result: { success: true, token, role } };
        }

        return { result: { success: false } };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
  });

  return { signIn, isPending };
}
