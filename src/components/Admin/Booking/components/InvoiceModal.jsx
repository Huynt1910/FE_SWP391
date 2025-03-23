import React from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";

const InvoiceModal = ({ data, onClose }) => {
  const router = useRouter();

  if (!data) return null;

  const formattedDate = data.bookingDate
    ? format(new Date(data.bookingDate), "dd/MM/yyyy")
    : "N/A"; // Fallback if bookingDate is invalid

  const handleCashPayment = async () => {
    await checkoutBooking(data.bookingId);
    onClose();
  };

  const handleVnpayPayment = async () => {
    const paymentUrl = await getVNPayUrl(data.bookingId);
    if (paymentUrl) window.location.href = paymentUrl;
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-header">
          <h2>Hóa đơn dịch vụ</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
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
          <button className="btn btn-primary" onClick={handleCashPayment}>
            Thanh toán tiền mặt
          </button>
          <button className="btn btn-primary" onClick={handleVnpayPayment}>
            Thanh toán VNPay
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
