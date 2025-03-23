import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "@/lib/api-client";
import { ACTIONS } from "@/lib/api-client/constant";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { get } from "react-hook-form";

export const useTherapistActions = () => {
  const queryClient = useQueryClient();
  const token = getCookie("token");
  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const {
    data: therapists,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ALL_THERAPISTS,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  const { data: activeTherapists } = useQuery({
    queryKey: ["activeTherapists"],
    queryFn: async () => {
      const response = await APIClient.invoke({
        action: ACTIONS.GET_ACTIVE_THERAPISTS,
        headers: authHeaders,
      });
      return response.result || [];
    },
  });

  const { mutateAsync: createTherapist } = useMutation({
    mutationFn: async (formData) => {
      const response = await APIClient.invoke({
        action: ACTIONS.CREATE_THERAPIST,
        data: formData,
        headers: {
          ...authHeaders,
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["therapists"]);
    },
    onError: (error) => {
      // Log the full error response
      console.error("Error creating service:", error.response?.data || error);
      throw error;
    },
  });
  const { mutateAsync: deleteTherapist } = useMutation({
    mutationFn: async (id) => {
      const response = await APIClient.invoke({
        action: ACTIONS.DELETE_THERAPIST,
        pathParams: { id },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã ngưng hoạt động tài khoản thành công!");
      queryClient.invalidateQueries(["therapists"]);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi ngưng hoạt động tài khoản!");
      console.error(error);
    },
  });

  const { mutateAsync: restoreTherapist } = useMutation({
    mutationFn: async (id) => {
      const response = await APIClient.invoke({
        action: ACTIONS.RESTORE_THERAPIST,
        pathParams: { id },
        headers: authHeaders,
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Đã kích hoạt tài khoản thành công!");
      queryClient.invalidateQueries(["therapists"]);
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi kích hoạt tài khoản!");
      console.error(error);
    },
  });

  return {
    therapists,
    activeTherapists,
    isLoading,
    createTherapist,
    deleteTherapist,
    restoreTherapist,
  };
};
