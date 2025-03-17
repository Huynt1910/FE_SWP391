import { useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";

export const useCreateServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createService = async (serviceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getCookie("token");
      const response = await axios.post(`${API_URL}/services`, serviceData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error("Failed to create service");
      }

      return response.data.result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createService, isLoading, error };
};
