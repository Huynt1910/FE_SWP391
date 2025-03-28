import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { isOnline } from "@/utils/network";
import { showNetworkErrorToast } from "@/utils/toast";
import { useCheckoutBooking } from "@/auth/hook/admin/useCheckoutBooking";
import { usePayment } from "@/auth/hook/admin/usePayment";

const InvoiceModal = ({ data, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVNPayLoading, setIsVNPayLoading] = useState(false);

  const checkoutMutation = useCheckoutBooking();
  const paymentMutation = usePayment();

  if (!data) return null;

  const formattedDate = data.bookingDate
    ? format(new Date(data.bookingDate), "dd/MM/yyyy")
    : "N/A";

  const handleCashCheckout = async () => {
    if (!isOnline()) {
      showNetworkErrorToast();
      return;
    }

    setIsProcessing(true);
    try {
      await checkoutMutation.mutateAsync({ bookingId: data.bookingId });
      onClose();
    } catch (error) {
      toast.error("Lỗi khi thanh toán tiền mặt!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVNPay = async () => {
    if (!isOnline()) {
      showNetworkErrorToast();
      return;
    }

    setIsVNPayLoading(true);
    try {
      const qrUrl = await paymentMutation.mutateAsync(data.bookingId);
      if (qrUrl) {
        window.open(qrUrl, "_blank");
        toast.info("Đã mở liên kết thanh toán VNPay");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo liên kết thanh toán!");
    } finally {
      setIsVNPayLoading(false);
    }
  };

  const getServiceIcon = (serviceName) => {
    if (!serviceName) return "🔹";
    const name = serviceName.toLowerCase();
    if (name.includes("massage")) return "💆";
    if (name.includes("facial") || name.includes("face")) return "👩";
    if (name.includes("hair") || name.includes("tóc")) return "💇";
    if (name.includes("nail") || name.includes("móng")) return "💅";
    if (name.includes("spa")) return "🧖";
    if (name.includes("stress") || name.includes("relax")) return "🧘";
    if (name.includes("package")) return "📦";
    return "✨";
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content invoice-modal">
        <div className="admin-page__modal-header">
          <h2>Hóa Đơn Dịch Vụ</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="admin-page__modal-body">
          <div className="invoice-info">
            <div className="invoice-info__item">
              <span className="invoice-info__label">Mã đơn:</span>
              <span className="invoice-info__value">{data.bookingId}</span>
            </div>
            <div className="invoice-info__item">
              <span className="invoice-info__label">Ngày:</span>
              <span className="invoice-info__value">{formattedDate}</span>
            </div>
            <div className="invoice-info__item">
              <span className="invoice-info__label">Khách hàng:</span>
              <span className="invoice-info__value">
                {data.customerName || "N/A"}
              </span>
            </div>
            <div className="invoice-info__item">
              <span className="invoice-info__label">Nhân viên:</span>
              <span className="invoice-info__value">
                {data.stylistName || "N/A"}
              </span>
            </div>
          </div>

          <div className="invoice-services">
            <h3>Dịch Vụ Đã Sử Dụng</h3>
            <div className="service-list">
              {data.services?.map((service, index) => (
                <div className="service-item" key={index}>
                  <div className="service-item__info">
                    <div className="service-item__icon">
                      {getServiceIcon(service.serviceName)}
                    </div>
                    <div className="service-item__name">
                      {service.serviceName || "N/A"}
                    </div>
                  </div>
                  <div className="service-item__price">
                    {service.price?.toLocaleString() || "0"}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.voucher && (
            <div className="invoice-voucher">
              <span className="invoice-voucher__label">Voucher áp dụng:</span>
              <span className="invoice-voucher__value">{data.voucher}</span>
            </div>
          )}

          <div className="invoice-total">
            <span className="invoice-total__label">Tổng Thanh Toán:</span>
            <span className="invoice-total__value">
              {data.totalAmount?.toLocaleString() || "0"}đ
            </span>
          </div>
        </div>

        <div className="admin-page__modal-footer">
          <button
            className="btn btn-cash"
            onClick={handleCashCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "💵 Thanh toán tiền mặt"}
          </button>

          <button
            className="btn btn-vnpay"
            onClick={handleVNPay}
            disabled={isVNPayLoading}
          >
            {isVNPayLoading
              ? "Đang tạo liên kết..."
              : "🏦 Thanh toán chuyển khoản"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
