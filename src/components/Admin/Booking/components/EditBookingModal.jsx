import { useUpdateBooking } from "@/auth/hook/admin/useUpdateBooking";
import { useCheckTherapistAvailability } from "@/auth/hook/admin/useCheckTherapistAvailability";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

const EditBookingModal = ({ booking, slots, onClose }) => {
  const [formData, setFormData] = useState({
    slotId: booking.slotId || "",
    bookingDate: booking.bookingDate
      ? new Date(booking.bookingDate)
      : new Date(),
    therapistId: booking.therapistId || "",
  });

  const { mutate: updateBooking, isLoading: updating } = useUpdateBooking();
  const {
    therapists: availableTherapists,
    loading: checkingTherapist,
    error: therapistError,
    checkTherapistAvailability,
  } = useCheckTherapistAvailability();

  // Gọi API kiểm tra therapist khi slotId hoặc bookingDate thay đổi
  useEffect(() => {
    if (formData.slotId && formData.bookingDate) {
      const payload = {
        serviceId: booking.serviceId, // Dịch vụ khách đã book
        date: formData.bookingDate.toISOString().split("T")[0],
        slotId: Number(formData.slotId),
      };

      checkTherapistAvailability(payload);
    }
  }, [formData.slotId, formData.bookingDate]);

  const handleUpdateBooking = () => {
    const payload = {
      userId: booking.userId, // Lấy userId từ booking
      serviceId: booking.serviceId, // Lấy serviceId từ booking
      slotId: Number(formData.slotId),
      bookingDate: formData.bookingDate.toISOString().split("T")[0],
      therapistId: Number(formData.therapistId),
    };

    updateBooking(
      { bookingId: booking.id, payload },
      {
        onSuccess: () => {
          onClose(); // Đóng modal
        },
      }
    );
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa lịch hẹn</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="admin-page__modal-content-body">
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
              {slots.map((slot) => (
                <option key={slot.slotid} value={slot.slotid}>
                  {slot.slottime}
                </option>
              ))}
            </select>
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
              disabled={checkingTherapist || !availableTherapists.length}
            >
              <option value="">-- Chọn chuyên viên --</option>
              {availableTherapists.map((therapist) => (
                <option key={therapist.id} value={therapist.id}>
                  {therapist.fullName}
                </option>
              ))}
            </select>
            {checkingTherapist && <p>Đang kiểm tra chuyên viên...</p>}
            {therapistError && <p className="error">{therapistError}</p>}
          </div>
        </div>

        <div className="admin-page__modal-content-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Hủy
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpdateBooking}
            disabled={
              updating ||
              !formData.slotId ||
              !formData.bookingDate ||
              !formData.therapistId
            }
          >
            {updating ? "Đang cập nhật..." : "Cập nhật"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
