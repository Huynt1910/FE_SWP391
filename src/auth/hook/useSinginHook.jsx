import { ACTIONS } from "@/lib/api-client/constant";
import { APIClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";

export function useSignIn() {
  const mutation = useMutation({
    mutationFn: async (credentials) => {
      console.log("Sending login request:", credentials); // Debug log

      const response = await APIClient.invoke({
        action: ACTIONS.SIGN_IN,
        data: credentials,
      });

      console.log("Raw API response:", response); // Debug log

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      return response;
    },
  });

  return {
    signIn: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
