import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { isOnline } from "@/utils/network";
import { showNetworkErrorToast } from "@/utils/toast";

const InvoiceModal = ({ data, onCheckout, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!data) return null;

  const formattedDate = data.bookingDate
    ? format(new Date(data.bookingDate), "dd/MM/yyyy")
    : "N/A";

  const handleCheckout = async () => {
    // Check for internet connection first
    if (!isOnline()) {
      showNetworkErrorToast();
      return;
    }
    
    setIsProcessing(true);
    try {
      await onCheckout(data.bookingId);
      toast.success("Thanh toán thành công!");
      onClose();
    } catch (error) {
      console.error("Error during checkout:", error);
      // Check if it's a network error
      if (error.isOffline || error.message?.includes("network") || 
          error.message?.includes("internet") || error.message?.includes("connection")) {
        showNetworkErrorToast();
      } else {
        toast.error("Lỗi khi thực hiện thanh toán!");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate a service icon based on service name
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
    return "✨"; // Default icon
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
              <span className="invoice-info__value">{data.customerName || "N/A"}</span>
            </div>
            <div className="invoice-info__item">
              <span className="invoice-info__label">Nhân viên:</span>
              <span className="invoice-info__value">{data.stylistName || "N/A"}</span>
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
            className={`btn-checkout ${isProcessing ? 'processing' : ''}`}
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "✅ Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
