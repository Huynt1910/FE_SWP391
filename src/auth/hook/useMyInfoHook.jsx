import { APIClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import { ACTIONS } from "@lib/api-client/constant";
import { getCookie, setCookie } from "cookies-next";

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
        const user = response.result;

        // ✅ Lưu userId vào cookie giống như token và userRole
        const cookieOptions = {
          maxAge: 24 * 60 * 60, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        };

        setCookie("userId", user.id, cookieOptions);

        return { profile: user, token: token };
      }

      throw new Error(response.message || "Lỗi khi lấy thông tin cá nhân");
    },
    enabled: !!token,
  });
}
