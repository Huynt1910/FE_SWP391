import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getCookie } from "cookies-next";
import { API_URL } from "@/lib/api-client/constantAdmin";

export const useDashboardActions = () => {
  const token = getCookie("token");

  const useGetDashboardStats = (month) => {
    return useQuery({
      queryKey: ["dashboard", month],
      queryFn: async () => {
        try {
          // Log the responses to check the data structure
          const [bookingsCount, totalMoney, customerCount, serviceCount] =
            await Promise.all([
              axios.get(`${API_URL}/admin/booking/count/${month}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get(`${API_URL}/admin/booking/total-money/month/${month}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get(`${API_URL}/admin/customer/count`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get(`${API_URL}/admin/service/count`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

          console.log("Bookings Count:", bookingsCount.data);
          console.log("Total Money:", totalMoney.data);
          console.log("Customer Count:", customerCount.data);
          console.log("Service Count:", serviceCount.data);

          return {
            totalBookings: bookingsCount.data.result || 0,
            totalRevenue: totalMoney.data.result || 0,
            totalCustomers: customerCount.data.result || 0,
            totalServices: serviceCount.data.result || 0,
          };
        } catch (error) {
          console.error("Dashboard data fetch error:", error);
          throw error;
        }
      },
    });
  };

  return {
    useGetDashboardStats,
  };
};
