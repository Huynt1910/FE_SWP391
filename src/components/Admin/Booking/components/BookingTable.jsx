import React, { useMemo, useState } from "react";
import {
  FaEdit,
  FaCheck,
  FaPrint,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";
import { format } from "date-fns";
import InvoiceModal from "./InvoiceModal";
import { toast } from "react-toastify";
import EditBookingModal from "./EditBookingModal";
import { useSlotActions } from "@/auth/hook/admin/useSlotActions";
import { useCancelBooking } from "@/auth/hook/admin/useCancelBooking";

const BookingTable = ({
  bookings,
  services,
  customers = [],
  therapists = [],
  vouchers = [],
  onCheckIn,
  onComplete,
}) => {
  const { mutate: cancelBooking, isLoading: isCancelling } = useCancelBooking();
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const { slots } = useSlotActions();
  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      map[s.serviceId] = s.serviceName;
    });
    return map;
  }, [services]);

  const userMap = useMemo(() => {
    const map = {};
    customers.forEach((u) => {
      map[u.id] = {
        fullName: `${u.firstName} ${u.lastName}`,
        phone: u.phone,
      };
    });
    return map;
  }, [customers]);

  const therapistMap = useMemo(() => {
    const map = {};
    therapists.forEach((t) => {
      map[t.id] = t.fullName;
    });
    return map;
  }, [therapists]);

  const voucherMap = useMemo(() => {
    const map = {};
    vouchers.forEach((voucher) => {
      map[voucher.voucherId] = voucher.voucherName;
    });
    return map;
  }, [vouchers]);

  const getServiceNames = (serviceIds) => {
    if (!Array.isArray(serviceIds)) return "Không có dịch vụ";

    const serviceNames = serviceIds.map((id) => serviceMap[id]).filter(Boolean);
    return serviceNames.length > 0
      ? serviceNames.join(", ")
      : "Không có dịch vụ";
  };

  const getUserDetails = (userId) => {
    const user = userMap[userId];
    if (!user) return { fullName: "Không có thông tin", phone: "N/A" };
    return user;
  };

  const getTherapistName = (therapistId) => {
    return therapistMap[therapistId] || "Không có thông tin";
  };

  const getVoucherName = (voucherId) => {
    return voucherMap[voucherId] || "Không có voucher";
  };

  const handleCheckIn = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await onCheckIn(bookingId); // Chỉ gọi API, không show hóa đơn
    } catch (error) {
      console.error("Error during check-in:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCompleteBooking = async (booking) => {
    setProcessingId(booking.id);
    try {
      const response = await onComplete(booking.id);
      if (response?.result) {
        setSelectedBooking(response.result);
        setShowInvoice(true);
      }
    } catch (error) {
      console.error("Error completing booking:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleEdit = (booking) => {
    if (booking.status !== "PENDING") {
      return;
    }
    setEditingBooking(booking);
  };

  const handleCancelBooking = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await cancelBooking(bookingId);
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const getActionButton = (booking) => {
    if (processingId === booking.id) {
      return (
        <button disabled className="action-btn loading">
          <FaSpinner className="spinner" />
        </button>
      );
    }

    switch (booking.status) {
      case "PENDING":
        return (
          <>
            <button
              className="action-btn cancel"
              onClick={() => handleCancelBooking(booking.id)}
              title="Hủy lịch hẹn"
            >
              <FaTimesCircle />
            </button>
            <button
              className="action-btn checkin"
              onClick={() => handleCheckIn(booking.id)}
              title="Check-in"
            >
              <FaCheck />
            </button>
          </>
        );

      case "IN_PROGRESS":
        return (
          <button
            className="action-btn complete"
            onClick={() => handleCompleteBooking(booking)}
            title="Hoàn tất & In hóa đơn"
          >
            <FaPrint />
          </button>
        );

      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-badge status-badge--pending"; // Màu vàng
      case "IN_PROGRESS":
        return "status-badge status-badge--in-progress"; // Màu xanh dương
      case "COMPLETED":
        return "status-badge status-badge--completed"; // Màu xanh lá
      case "CANCELLED":
        return "status-badge status-badge--cancelled"; // Màu đỏ
      default:
        return "status-badge";
    }
  };

  const formatToLocalDate = (utcDate) => {
    const localDate = new Date(utcDate);
    return format(localDate, "dd/MM/yyyy");
  };

  return (
    <>
      <div className="admin-page__table">
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Số điện thoại</th>
              <th>Chuyên viên</th>
              <th>Ngày hẹn</th>
              <th>Giờ hẹn</th>
              <th>Dịch vụ</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const userDetails = getUserDetails(booking.userId);
              return (
                <tr key={booking.id}>
                  <td>{userDetails.fullName}</td>
                  <td>{userDetails.phone}</td>
                  <td>{getTherapistName(booking.therapistId)}</td>
                  <td>{formatToLocalDate(booking.date)}</td>
                  <td>{booking.time}</td>
                  <td>
                    {booking.serviceId && booking.serviceId.length > 0 ? (
                      getServiceNames(booking.serviceId)
                    ) : (
                      <span className="no-data">Không có dịch vụ</span>
                    )}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {["CANCELLED", "COMPLETED", "IN_PROGRESS"].includes(
                        booking.status
                      ) ? null : (
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(booking)}
                        >
                          <FaEdit />
                        </button>
                      )}
                      {getActionButton(booking)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Hóa đơn chỉ hiện khi hoàn tất booking
      {showInvoice && selectedBooking && (
        <InvoiceModal
          data={selectedBooking}
          onClose={() => {
            setShowInvoice(false);
            setSelectedBooking(null);
          }}
        />
      )} */}

      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          slots={slots}
          therapists={therapists}
          onClose={() => setEditingBooking(null)}
        />
      )}
    </>
  );
};

export default BookingTable;
