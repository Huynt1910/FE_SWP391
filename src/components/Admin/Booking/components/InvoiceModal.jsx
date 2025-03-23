import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";

const InvoiceModal = ({ data, onCheckout }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!data) return null;

  const formattedDate = data.bookingDate
    ? format(new Date(data.bookingDate), "dd/MM/yyyy")
    : "N/A"; // Fallback nếu bookingDate không hợp lệ

  const handleCheckout = async () => {
    setIsProcessing(true); // Hiển thị trạng thái loading
    try {
      await onCheckout(data.bookingId); // Gọi hàm onCheckout với bookingId
      toast.success("Thanh toán thành công!");
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Lỗi khi thực hiện thanh toán!");
    } finally {
      setIsProcessing(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-header">
          <h2>Hóa đơn dịch vụ</h2>
        </div>

        <div className="admin-page__modal-body">
          <div className="invoice-info">
            <p>
              <strong>Mã đơn:</strong> {data.bookingId}
            </p>
            <p>
              <strong>Ngày:</strong> {formattedDate}
            </p>
            <p>
              <strong>Khách hàng:</strong> {data.customerName || "N/A"}
            </p>
            <p>
              <strong>Nhân viên:</strong> {data.stylistName || "N/A"}
            </p>
          </div>

          <div className="invoice-services">
            <h3>Dịch vụ đã sử dụng</h3>
            <table>
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Hình ảnh</th>
                  <th>Giá tiền</th>
                </tr>
              </thead>
              <tbody>
                {data.services?.map((service, index) => (
                  <tr key={index}>
                    <td>{service.serviceName || "N/A"}</td>
                    <td>
                      <img
                        src={service.image}
                        alt={service.serviceName}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{service.price?.toLocaleString() || "0"}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.voucher && (
            <div className="invoice-voucher">
              <p>
                <strong>Voucher áp dụng:</strong> {data.voucher}
              </p>
            </div>
          )}

          <div className="invoice-total">
            <h3>
              Tổng thanh toán: {data.totalAmount?.toLocaleString() || "0"}đ
            </h3>
          </div>
        </div>

        <div className="admin-page__modal-footer">
          <button
            className="btn btn-primary"
            onClick={handleCheckout}
            disabled={isProcessing} // Vô hiệu hóa nút khi đang xử lý
          >
            {isProcessing ? "Đang xử lý..." : "Thanh toán tiền mặt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
