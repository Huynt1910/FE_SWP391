import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { toast } from "react-toastify";

export const useCustomerActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const useGetAllCustomers = () => {
    return useQuery({
      queryKey: ["allCustomers"],
      queryFn: async () => {
        const response = await axios.get(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.result || [];
      },
    });
  };

  const useGetActiveCustomers = () => {
    const { data: allCustomers = [] } = useGetAllCustomers();
    return {
      data: allCustomers.filter((customer) => customer.status),
      isLoading: false,
    };
  };

  const useGetInactiveCustomers = () => {
    const { data: allCustomers = [] } = useGetAllCustomers();
    return {
      data: allCustomers.filter((customer) => !customer.status),
      isLoading: false,
    };
  };

  const useDeactivateCustomer = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/users/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allCustomers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useActivateCustomer = () => {
    return useMutation({
      mutationFn: async (id) => {
        const response = await axios.put(
          `${API_URL}/users/active/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allCustomers"]);
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
          `${API_URL}/users/reset-password/${id}`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allCustomers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useAddCustomer = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await axios.post(
          `${API_URL}/users`,
          {
            username: data.username,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            birthDate: data.birthDate,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
        queryClient.invalidateQueries(["allCustomers"]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  const useResetCustomerPassword = () => {
    return useMutation({
      mutationFn: async ({ id, data }) => {
        const response = await axios.put(
          `${API_URL}/users/reset-password/${id}`,
          {
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      },
    });
  };

  return {
    useGetAllCustomers,
    useGetActiveCustomers,
    useGetInactiveCustomers,
    useDeactivateCustomer,
    useActivateCustomer,
    useResetPassword,
    useAddCustomer,
    useResetCustomerPassword,
  };
};
