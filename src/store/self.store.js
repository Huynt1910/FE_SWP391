import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { useQuery } from "@tanstack/react-query";

export function useSelf() {
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: async () => {
      const response = await APIClient.invoke({
<<<<<<< HEAD
        action: ACTIONS.GET_SELF,
      });

      if (response.status_code === 200) {
        return response.data;
=======
        action: ACTIONS.MY_INFO,
      });

      if (response?.success) {
        return response?.result;
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
      }

      console.log(response.data.message);
      return null;
    },
  });

  return { self: data, isLoadingSelf: isLoading };
}
