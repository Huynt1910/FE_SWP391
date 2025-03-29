import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";

export const usePaymentResponse = (queryParams) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu queryParams không tồn tại, không gọi API
    if (!queryParams || Object.keys(queryParams).length === 0) return;

    const fetchPaymentResponse = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getCookie("token"); // Lấy token từ cookie
        if (!token) {
          throw new Error("Token không tồn tại hoặc đã hết hạn");
        }

        const url = new URL(
          "https://skincare-booking-api-3e537a79674f.herokuapp.com/api/payment/response"
        );

        // Thêm query parameters vào URL
        Object.keys(queryParams).forEach((key) =>
          url.searchParams.append(key, queryParams[key])
        );

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment response");
        }

        const result = await response.text(); // API trả về text
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentResponse();
  }, [queryParams]); // Chỉ chạy khi queryParams thay đổi

  return { data, isLoading, error };
};
