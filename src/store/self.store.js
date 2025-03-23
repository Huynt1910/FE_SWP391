import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated, handleAuthError } from "@/utils/auth";

export function useSelf() {
  const authenticated = isAuthenticated();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["self", authenticated],
    queryFn: async () => {
      try {
        const response = await APIClient.invoke({
          action: ACTIONS.MY_INFO,
        });

        if (response?.success) {
          return response?.result;
        }

        console.log("Failed to fetch user info:", response?.message || "Unknown error");
        return null;
      } catch (error) {
        console.error("Error fetching user info:", error.message);
        handleAuthError(error);
        return null;
      }
    },
    enabled: authenticated, // Only run the query if authenticated
    retry: false, // Don't retry on failure to avoid infinite redirects
  });

  return { self: data, isLoadingSelf: isLoading, error };
}