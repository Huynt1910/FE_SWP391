import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { toast } from "react-toastify";

export const useServiceActions = () => {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const useGetAllServices = () => {
    return useQuery({
      queryKey: ["services"],
      queryFn: async () => {
        try {
          const response = await axios.get(`${API_URL}/services`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log("API Response:", response.data); // Debug log
          return response.data;
        } catch (error) {
          console.error("API Error:", error);
          throw error;
        }
      },
    });
  };

  const createService = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();

      // Add text fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("duration", data.duration);

      // Add image if exists
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post(`${API_URL}/services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });

  const updateService = useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();

      // Add text fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("duration", data.duration);

      // Add image only if new image is selected
      if (data.image && data.image instanceof File) {
        formData.append("image", data.image);
      }

      const response = await axios.put(`${API_URL}/services/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
  });

  const useDeactivateService = () => {
    return useMutation({
      mutationFn: async (serviceId) => {
        const response = await axios.put(
          `${API_URL}/services/deactive/${serviceId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Đã ngưng hoạt động dịch vụ thành công!");
        queryClient.invalidateQueries(["services"]);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi ngưng hoạt động dịch vụ!");
      },
    });
  };

  const useActivateService = () => {
    return useMutation({
      mutationFn: async (serviceId) => {
        const response = await axios.put(
          `${API_URL}/services/active/${serviceId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      },
      onSuccess: () => {
        toast.success("Đã kích hoạt dịch vụ thành công!");
        queryClient.invalidateQueries(["services"]);
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi kích hoạt dịch vụ!");
      },
    });
  };

  return {
    useGetAllServices,
    createService,
    updateService,
    useDeactivateService,
    useActivateService,
  };
};
