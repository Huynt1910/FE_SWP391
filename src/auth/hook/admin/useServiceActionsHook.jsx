import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { isOnline } from "@/utils/network";

export const useServiceActions = () => {
  const queryClient = useQueryClient();
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const {
    data: services,
    isLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      // Check network connectivity first
      if (!isOnline()) {
        toast.error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
        return [];
      }

      try {
        const response = await APIClient.invoke({
          action: ACTIONS.GET_ALL_SERVICES,
          headers: authHeaders,
        });

        // Check if we received an offline error
        if (response.isOffline) {
          console.log("Offline response received in useServiceActions");
          return [];
        }

        return response.result || [];
      } catch (error) {
        // Handle network errors
        if (
          error.message?.includes("network") ||
          error.message?.includes("internet") ||
          error.message?.includes("connection")
        ) {
          toast.error(
            "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
          );
          return [];
        }
        throw error;
      }
    },
    // Don't retry on network errors
    retry: (failureCount, error) => {
      if (error?.isOffline || error?.message?.includes("network")) {
        return false;
      }
      return failureCount < 2;
    },
  });

  const { mutateAsync: updateService } = useMutation({
    mutationFn: async ({ id, formData }) => {
      const response = await APIClient.invoke({
        action: ACTIONS.UPDATE_SERVICE,
        pathParams: { id },
        data: formData,
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      toast.error("Lỗi cập nhật dịch vụ!");
      console.error("Error updating service:", error.response?.data || error);
    },
  });

  const { mutateAsync: createService } = useMutation({
    mutationFn: async (formData) => {
      // Check network connectivity first
      if (!isOnline()) {
        toast.error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
        throw new Error("No internet connection");
      }

      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_SERVICE,
        data: formData,
        headers: {
          ...authHeaders,
        },
      });

      // Check if we received an offline error
      if (response.isOffline) {
        throw new Error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      // Check if this is a network error
      if (
        error.message?.includes("network") ||
        error.message?.includes("internet") ||
        error.message?.includes("connection") ||
        error.isOffline
      ) {
        toast.error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
      } else {
        // Log the full error response for other errors
        console.error("Error creating service:", error.response?.data || error);
      }
      throw error;
    },
  });

  const activateService = useMutation({
    mutationFn: async (serviceId) => {
      // Check network connectivity first
      if (!isOnline()) {
        toast.error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
        throw new Error("No internet connection");
      }

      const response = await APIClient.invoke({
        action: ACTIONS.ACTIVE_SERVICE,
        pathParams: { id: serviceId },
        headers: authHeaders,
      });

      // Check if we received an offline error
      if (response.isOffline) {
        throw new Error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
      }

      return response;
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt dịch vụ thành công!");
      queryClient.invalidateQueries(["services"]); // Replace refetch with queryClient
    },
    onError: (error) => {
      // Check if this is a network error
      if (
        error.message?.includes("network") ||
        error.message?.includes("internet") ||
        error.message?.includes("connection") ||
        error.isOffline
      ) {
        toast.error(
          "Không có kết nối mạng. Vui lòng kiểm tra lại kết nối Internet của bạn."
        );
      } else {
        toast.error("Có lỗi xảy ra khi kích hoạt dịch vụ!");
        console.error(error);
      }
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
    updateService,
    createService,
    activateService: activateService.mutate,
    deactivateService: deactivateService.mutate,
  };
};
