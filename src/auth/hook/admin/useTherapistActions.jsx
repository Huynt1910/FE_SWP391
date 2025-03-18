import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { toast } from "react-toastify";

export const useTherapistActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const useGetAllTherapists = () => {
    return useQuery({
      queryKey: ["allTherapists"],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/therapists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.result || [];
      },
    });
  };

  const useGetActiveTherapists = () => {
    return useQuery({
      queryKey: ["activeTherapists"],
      queryFn: async () => {
        const response = await axios.get(
          `${API_URL}/therapists/activeTherapists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.result || [];
      },
    });
  };

  const useGetInactiveTherapists = () => {
    return useQuery({
      queryKey: ["inactiveTherapists"],
      queryFn: async () => {
        const response = await axios.get(
          `${API_URL}/therapists/inactiveTherapists`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.result || [];
      },
    });
  };

  const useAddTherapist = () => {
    return useMutation({
      mutationFn: async (formData) => {
        const response = await axios.post(`${API_URL}/therapists`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["allTherapists"]);
        queryClient.invalidateQueries(["activeTherapists"]);
      },
      onError: (error) => {
        throw error;
      },
    });
  };

  const useUpdateTherapist = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axios.put(
          `${API_URL}/therapists/updateTherapist/${id}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công!");
        queryClient.invalidateQueries(["allTherapists"]);
        queryClient.invalidateQueries(["activeTherapists"]);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
      },
    });
  };

  const useDeleteTherapist = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/therapists/delete/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Đã ngưng hoạt động therapist thành công!");
        queryClient.invalidateQueries(["allTherapists"]);
        queryClient.invalidateQueries(["activeTherapists"]);
        queryClient.invalidateQueries(["inactiveTherapists"]);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi ngưng hoạt động therapist!");
      },
    });
  };

  const useRestoreTherapist = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/therapists/restore/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Đã khôi phục hoạt động therapist thành công!");
        queryClient.invalidateQueries(["allTherapists"]);
        queryClient.invalidateQueries(["activeTherapists"]);
        queryClient.invalidateQueries(["inactiveTherapists"]);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi khôi phục therapist!");
      },
    });
  };

  const useResetPassword = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        console.log("Resetting password for therapist ID:", id); // For debugging
        const response = await axios.put(
          `${API_URL}/therapists/reset-password/${id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Đặt lại mật khẩu thành công!");
        queryClient.invalidateQueries(["therapists"]);
      },
      onError: (error) => {
        console.error("Reset password error:", error);
        toast.error("Có lỗi xảy ra khi đặt lại mật khẩu!");
      },
    });
  };

  return {
    useGetAllTherapists,
    useGetActiveTherapists,
    useGetInactiveTherapists,
    useAddTherapist,
    useUpdateTherapist,
    useDeleteTherapist,
    useRestoreTherapist,
    useResetPassword,
  };
};
