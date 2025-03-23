import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

export const useServiceActions = () => {
  const queryClient = useQueryClient();
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_SERVICES,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  const { mutateAsync: createService } = useMutation({
    mutationFn: async (formData) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_SERVICE,
        data: formData,
        headers: {
          ...authHeaders,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      // Log the full error response
      console.error("Error creating service:", error.response?.data || error);
      throw error;
    },
  });

  const activateService = useMutation({
    mutationFn: async (serviceId) => {
      const response = await APIClient.invoke({
        action: ACTIONS.ACTIVE_SERVICE,
        pathParams: { id: serviceId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt dịch vụ thành công!");
      queryClient.invalidateQueries(["services"]); // Replace refetch with queryClient
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi kích hoạt dịch vụ!");
      console.error(error);
    },
  });

  const deactivateService = useMutation({
    mutationFn: async (serviceId) => {
      const response = await APIClient.invoke({
        action: ACTIONS.DEACTIVE_SERVICE,
        pathParams: { id: serviceId },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã ngưng hoạt động dịch vụ thành công!");
      queryClient.invalidateQueries(["services"]); // Replace refetch with queryClient
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi ngưng hoạt động dịch vụ!");
      console.error(error);
    },
  });

  return {
    services,
    isLoading,
    createService,
    activateService: activateService.mutate,
    deactivateService: deactivateService.mutate,
  };
};
