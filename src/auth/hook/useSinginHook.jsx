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
      const { result } = await APIClient.invoke({
        action: ACTIONS.SIGN_IN,
        data: params,
      });

      if (result && result.success == true) {
        const { token } = result;

        setCookie("token", token);

        router.push("/"); // Navigate to home page
        showToast.success("Successfully signed in!");
      } else {
        showToast.error("Invalid credentials!");
      }
    },
  });

  return { signIn, isPending };
}
