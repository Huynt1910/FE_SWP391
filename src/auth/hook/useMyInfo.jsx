import { ACTIONS } from "@lib/api-client/constant";
import { APIClient } from "@lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { showToast } from "@utils/toast";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";

export function useMyInfo() {
  const {
    mutateAsync: updateProfile,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: async (profileData) => {
      return await APIClient.invoke({
        action: ACTIONS.UPDATE_PROFILE,
        data: profileData,
      });
    },
  });

  return { updateProfile, isPending, isError, isSuccess, error };
}
