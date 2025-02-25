// src/auth/hook/useSignUp.js

import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";

export function useSignUp() {
  const router = useRouter();

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: async (params) => {
      const { data, status_code } = await APIClient.invoke({
        action: ACTIONS.SIGN_UP,
        data: params,
      });

      if (status_code === 201) {
        showToast.success(
          "Successfully signed up! Please check your email to verify your account."
        );
        router.push("/login");
      } else {
        showToast.error("Sign-up failed! Please try again.");
      }
    },
  });

  return { signUp, isPending };
}
