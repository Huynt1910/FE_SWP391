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
      mutationFn: async (data) => {
        const formData = new FormData();

        // Map form fields according to API spec
        const fields = {
          username: data.username,
          password: data.password,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          gender: data.gender,
          birthDate: data.birthDate,
          yearExperience: data.yearExperience,
        };

        // Append all text fields
        Object.keys(fields).forEach((key) => {
          if (fields[key] !== undefined && fields[key] !== null) {
            formData.append(key, fields[key]);
          }
        });

        // Append image file with correct field name
        if (data.image) {
          formData.append("imgUrl", data.image);
        }

        // Log FormData for debugging
        for (let pair of formData.entries()) {
          console.log("FormData:", pair[0], pair[1]);
        }

        const response = await axios.post(`${API_URL}/therapists`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data;
      },
      onSuccess: () => {
        toast.success("Thêm therapist thành công!");
        queryClient.invalidateQueries(["allTherapists"]);
        queryClient.invalidateQueries(["activeTherapists"]);
      },
      onError: (error) => {
        console.error("Add Therapist Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi thêm therapist!"
        );
      },
    });
  };

  const useUpdateTherapist = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const formData = new FormData();

        // Map form fields according to API spec
        const fields = {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          gender: data.gender,
          birthDate: data.birthDate,
          yearExperience: data.yearExperience,
        };

        // Append all text fields
        Object.keys(fields).forEach((key) => {
          if (fields[key] !== undefined && fields[key] !== null) {
            formData.append(key, fields[key]);
          }
        });

        // Append image file with correct field name
        if (data.image instanceof File) {
          formData.append("imgUrl", data.image);
        }

        const response = await axios.put(
          `${API_URL}/therapists/updateTherapist/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      },
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công!");
        queryClient.invalidateQueries(["allTherapists"]);
        queryClient.invalidateQueries(["activeTherapists"]);
        queryClient.invalidateQueries(["inactiveTherapists"]);
      },
      onError: (error) => {
        console.error("Update Error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        toast.error(
          error.response?.data?.message || "Có lỗi xảy ra khi cập nhật!"
        );
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
