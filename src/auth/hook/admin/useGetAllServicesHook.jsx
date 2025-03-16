import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { showToast } from "@/utils/toast";
import { API_URL } from "@/lib/api-client/constantAdmin";

export function useCreateServices() {
  const token = getCookie("token");
  const queryClient = useQueryClient();

  const createService = useMutation({
    mutationFn: async (serviceData) => {
      const formattedData = {
        serviceName: serviceData.name,
        description: serviceData.description,
        price: parseFloat(serviceData.price),
        isActive: serviceData.active,
        duration: convertMinutesToTime(serviceData.duration),
        imgUrl: serviceData.image || "",
      };

      const response = await axios.post(
        "http://localhost:8080/api/services",
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },
    onSuccess: () => {
      showToast.success("Tạo dịch vụ thành công");
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || "Lỗi khi tạo dịch vụ");
    },
  });

  // Helper function to convert minutes to HH:mm format
  const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${remainingMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  return { createService };
}

export function useGetAllServices() {
  const token = getCookie("token");

  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.result || [];
    },
  });
}
