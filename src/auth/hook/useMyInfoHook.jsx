import { APIClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { ACTIONS } from "@lib/api-client/constant";
import { getCookie } from "cookies-next";

export function useMyInfo() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["profile", token],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.MY_INFO,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response && response.success === true) {
        return { profile: response.result, token: token };
      }

      throw new Error(response.message || "Lỗi khi lấy thông tin cá nhân");
    },
    enabled: !!token,
  });
}
