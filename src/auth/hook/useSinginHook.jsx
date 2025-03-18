import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

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

        if (!loginResponse?.result?.token) {
          throw new Error("Invalid login response");
        }

        const token = loginResponse.result.token;
        setCookie("token", token);

        // Step 2: Get user info using token
        const userInfoResponse = await APIClient.invoke({
          action: ACTIONS.MY_INFO,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userInfoResponse?.result) {
          throw new Error("Failed to get user info");
        }

        const userRole = userInfoResponse.result.role;
        setCookie("userRole", userRole);

        return {
          success: true,
          token,
          role: userRole,
          user: userInfoResponse.result,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
  });

  return { signIn, isPending };
}
