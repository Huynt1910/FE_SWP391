import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { toast } from "react-toastify";

export const useStaffActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const useGetAllStaffs = () => {
    return useQuery({
      queryKey: ["allStaffs"],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/staffs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.result || [];
      },
    });
  };

  const useGetActiveStaffs = () => {
    return useQuery({
      queryKey: ["activeStaffs"],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/staffs/activeStaffs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.result || [];
      },
    });
  };

  const useGetInactiveStaffs = () => {
    return useQuery({
      queryKey: ["inactiveStaffs"],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/staffs/inactiveStaffs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.result || [];
      },
    });
  };

  const useAddStaff = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await axios.post(
          `${API_URL}/staffs`,
          {
            username: data.username,
            password: data.password,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            birthDate: data.birthDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allStaffs"]);
        queryClient.invalidateQueries(["activeStaffs"]);
        queryClient.invalidateQueries(["inactiveStaffs"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useUpdateStaff = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axios.put(
          `${API_URL}/staffs/updateStaff/${id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["staffs"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useDeleteStaff = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/staffs/delete/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allStaffs"]);
        queryClient.invalidateQueries(["activeStaffs"]);
        queryClient.invalidateQueries(["inactiveStaffs"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useRestoreStaff = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/staffs/restore/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allStaffs"]);
        queryClient.invalidateQueries(["activeStaffs"]);
        queryClient.invalidateQueries(["inactiveStaffs"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useResetPassword = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axios.put(
          `${API_URL}/staffs/reset-password/${id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["staffs"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  return {
    useGetAllStaffs,
    useGetActiveStaffs,
    useGetInactiveStaffs,
    useAddStaff,
    useUpdateStaff,
    useDeleteStaff,
    useRestoreStaff,
    useResetPassword,
  };
};
