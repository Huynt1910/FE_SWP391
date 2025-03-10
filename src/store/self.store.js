import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useQuery } from "@tanstack/react-query";

export function useSelf() {
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.MY_INFO,
      });

      if (response?.success) {
        return response?.result;
      }

      console.log(response.data.message);
      return null;
    },
  });

  return { self: data, isLoadingSelf: isLoading };
}
