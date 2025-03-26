import { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { FaSpinner } from "react-icons/fa";
import { useVoucherActions } from "@/auth/hook/admin/useVoucherActions";
import { useSlotActions } from "@/auth/hook/admin/useSlotActions";
import { useCheckTherapistAvailability } from "@/auth/hook/admin/useCheckTherapistAvailability";
import { useGetActiveService } from "@/auth/hook/admin/useGetActiveService";
import Select from "react-select";

const BookingAddModal = ({ onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    slotId: "",
    bookingDate: new Date(),
    serviceId: [], // Chọn nhiều dịch vụ
    therapistId: "",
    voucherId: "",
  });

  const { vouchers } = useVoucherActions();
  const { slots } = useSlotActions();
  const {
    data: services,
    isLoading: loadingServices,
    error,
  } = useGetActiveService();
  console.log("Dữ liệu dịch vụ trong modal:", services);
  const {
    therapists,
    loading: loadingTherapists,
    error: therapistError,
    checkTherapistAvailability,
  } = useCheckTherapistAvailability();

  // ✅ Chọn nhiều dịch vụ
  const handleServiceChange = (serviceId) => {
    setFormData((prev) => {
      const updatedServices = prev.serviceId.includes(serviceId)
        ? prev.serviceId.filter((id) => id !== serviceId) // Bỏ chọn nếu đã chọn
        : [...prev.serviceId, serviceId]; // Thêm vào danh sách nếu chưa chọn
      return { ...prev, serviceId: updatedServices };
    });
  };

  const handleCheckTherapist = async () => {
    const { serviceId, bookingDate, slotId } = formData;

    if (!serviceId.length || !slotId || !bookingDate) {
      alert("Vui lòng chọn dịch vụ, ngày và khung giờ trước khi kiểm tra!");
      return;
    }

    const date = format(bookingDate, "yyyy-MM-dd");
    const payload = {
      serviceId,
      date,
      slotId: Number(slotId),
    };

    console.log("📤 Payload gửi đến API:", payload);

    try {
      await checkTherapistAvailability(payload);
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra therapist:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.therapistId) {
      alert("Vui lòng chọn chuyên viên trước khi tạo lịch hẹn!");
      return;
    }

    const bookingData = {
      phoneNumber: formData.phoneNumber,
      slotId: Number(formData.slotId),
      bookingDate: format(formData.bookingDate, "yyyy-MM-dd"),
      serviceId: formData.serviceId.map(Number), // Convert thành số
      therapistId: Number(formData.therapistId),
      voucherId: formData.voucherId ? Number(formData.voucherId) : null,
    };

    try {
      await onConfirm(bookingData);
      onClose();
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  // Xử lý nếu không có dữ liệu hoặc đang tải
  if (loadingServices) return <p>Đang tải danh sách dịch vụ...</p>;
  if (error) return <p>Lỗi: {error.message}</p>;

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
              required
            />
          </div>

          <div className="form-group">
            <label>Khung giờ:</label>
            <select
              value={formData.slotId}
              onChange={(e) =>
                setFormData({ ...formData, slotId: e.target.value })
              }
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
            <Select
              isMulti
              options={services?.map((service) => ({
                value: service.serviceId,
                label: service.serviceName || "Tên dịch vụ trống!",
              }))}
              value={services
                ?.filter((service) =>
                  formData.serviceId.includes(service.serviceId)
                )
                .map((service) => ({
                  value: service.serviceId,
                  label: service.serviceName,
                }))}
              onChange={(selectedOptions) =>
                setFormData({
                  ...formData,
                  serviceId: selectedOptions.map((option) => option.value),
                })
              }
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Chuyên viên:</label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCheckTherapist}
              disabled={loadingTherapists}
            >
              {loadingTherapists ? "Đang kiểm tra..." : "Kiểm tra chuyên viên"}
            </button>
            {therapistError && <p className="error">{therapistError}</p>}
            <select
              value={formData.therapistId}
              onChange={(e) =>
                setFormData({ ...formData, therapistId: e.target.value })
              }
              required
              className="form-control"
            >
              <option value="">-- Chọn chuyên viên --</option>
              {therapists?.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Mã giảm giá (Voucher):</label>
            <select
              value={formData.voucherId}
              onChange={(e) =>
                setFormData({ ...formData, voucherId: e.target.value })
              }
              className="form-control"
            >
              <option value="">-- Chọn voucher --</option>
              {vouchers?.map((voucher) => (
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
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
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
