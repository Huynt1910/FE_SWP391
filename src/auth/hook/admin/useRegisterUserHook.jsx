import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { showToast } from "@/utils/toast";

export function useRegisterUser() {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const registerUser = async ({ role, userData }) => {
    let endpoint;
    switch (role) {
      case "CUSTOMER":
        endpoint = "/users";
        break;
      case "STAFF":
        endpoint = "/staffs";
        break;
      case "THERAPIST":
        endpoint = "/therapists";
        break;
      default:
        throw new Error("Invalid role");
    }

    const response = await axios.post(`${API_URL}${endpoint}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables) => {
      showToast("Tạo tài khoản thành công!", "success");
      // Invalidate relevant queries based on role
      switch (variables.role) {
        case "CUSTOMER":
          queryClient.invalidateQueries(["users"]);
          break;
        case "STAFF":
          queryClient.invalidateQueries(["staffs"]);
          break;
        case "THERAPIST":
          queryClient.invalidateQueries(["therapists"]);
          break;
      }
    },
    onError: (error) => {
      showToast(error.response?.data?.message || "Có lỗi xảy ra", "error");
    },
  });
}
