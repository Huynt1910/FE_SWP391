import { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { FaSpinner } from "react-icons/fa";
import { useServiceActions } from "@/auth/hook/admin/useServiceActionsHook";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";
import { useVoucherActions } from "@/auth/hook/admin/useVoucherActions";
import { useSlotActions } from "@/auth/hook/admin/useSlotActions";

const BookingAddModal = ({ onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    slotId: "",
    bookingDate: new Date(),
    serviceId: [],
    therapistId: "",
    voucherId: "",
  });

  const { services, isLoading: loadingServices } = useServiceActions();
  const { activeTherapists, isLoading: loadingTherapists } =
    useTherapistActions();
  const { vouchers } = useVoucherActions();
  const { slots } = useSlotActions();

  // Filter active services
  const activeServices = services?.filter((s) => s.status) || [];

  const handleServiceChange = (serviceId) => {
    setFormData((prev) => {
      const updatedServices = prev.serviceId.includes(serviceId)
        ? prev.serviceId.filter((id) => id !== serviceId)
        : [...prev.serviceId, serviceId];
      return { ...prev, serviceId: updatedServices };
    });
  };

  const handleSlotChange = (e) => {
    const selectedSlotId = e.target.value;
    console.log("Selected slot:", {
      value: selectedSlotId,
      time: slots.find((slot) => slot.slotid === Number(selectedSlotId))
        ?.slottime,
    });
    setFormData({ ...formData, slotId: selectedSlotId });
  };

  const handleVoucherChange = (e) => {
    const selectedVoucherId = e.target.value;
    console.log("Selected voucher:", {
      value: selectedVoucherId,
      code: vouchers.find((v) => v.voucherId === Number(selectedVoucherId))
        ?.voucherCode,
    });
    setFormData({ ...formData, voucherId: selectedVoucherId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      phoneNumber: formData.phoneNumber,
      slotId: formData.slotId ? Number(formData.slotId) : null,
      bookingDate: format(formData.bookingDate, "yyyy-MM-dd"),
      serviceId: formData.serviceId.map((id) => Number(id)),
      therapistId: Number(formData.therapistId),
      voucherId: formData.voucherId ? Number(formData.voucherId) : null,
    };

    console.log("Submitting booking data:", bookingData);
    try {
      await onConfirm(bookingData);
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  const isLoaders = loadingServices || loadingTherapists;

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Tạo lịch hẹn mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Số điện thoại:</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              pattern="[0-9]{10}"
              required
              className="form-control"
              placeholder="Nhập số điện thoại khách hàng"
            />
          </div>

          <div className="form-group">
            <label>Ngày hẹn:</label>
            <DatePicker
              selected={formData.bookingDate}
              onChange={(date) =>
                setFormData({ ...formData, bookingDate: date })
              }
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="form-control"
              placeholderText="Chọn ngày hẹn"
              required
            />
          </div>

          <div className="form-group">
            <label>Khung giờ:</label>
            <select
              value={formData.slotId}
              onChange={handleSlotChange}
              required
              className="form-control"
            >
              <option value="">-- Chọn khung giờ --</option>
              {slots?.map((slot) => (
                <option key={slot.slotid} value={slot.slotid}>
                  {slot.slottime}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Dịch vụ:</label>
            <div className="services-checkbox-group">
              {activeServices.map((service) => (
                <div key={service.id} className="service-checkbox-item">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={formData.serviceId.includes(service.id)}
                    onChange={() => handleServiceChange(service.id)}
                  />
                  <label htmlFor={`service-${service.id}`}>
                    {service.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Chuyên viên:</label>
            <select
              value={formData.therapistId}
              onChange={(e) =>
                setFormData({ ...formData, therapistId: e.target.value })
              }
              required
              className="form-control"
            >
              <option value="">-- Chọn chuyên viên --</option>
              {activeTherapists?.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Mã giảm giá (không bắt buộc):</label>
            <select
              value={formData.voucherId}
              onChange={handleVoucherChange}
              className="form-control"
            >
              <option value="">-- Chọn voucher --</option>
              {vouchers
                ?.filter((v) => v.isActive)
                ?.map((voucher) => (
                  <option key={voucher.voucherId} value={voucher.voucherId}>
                    {voucher.voucherCode} - Giảm {voucher.percentDiscount}%
                  </option>
                ))}
            </select>
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoaders || isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoaders || isLoading}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="spinner" /> Đang xử lý...
                </>
              ) : (
                "Tạo lịch hẹn"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingAddModal;
