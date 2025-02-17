import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useQuery } from "@tanstack/react-query";

export function useSelf() {
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_SELF,
      });

      if (response.status_code === 200) {
        return response.data;
      }

      console.log(response.data.message);
      return null;
    },
  });

  return { self: data, isLoadingSelf: isLoading };
}
