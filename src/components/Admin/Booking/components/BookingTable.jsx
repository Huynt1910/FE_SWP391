import React, { useMemo, useState } from "react";
import { FaEdit, FaCheck, FaPrint, FaSpinner } from "react-icons/fa";
import { format } from "date-fns";
import InvoiceModal from "./InvoiceModal";

const BookingTable = ({
  bookings,
  services,
  customers = [], // Default to an empty array
  therapists = [], // Default to an empty array
  vouchers = [], // Default to an empty array
  onEdit,
  onCheckIn,
  onComplete,
}) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // Create a map for services
  const serviceMap = useMemo(() => {
    const map = {};
    services.forEach((s) => {
      map[s.serviceId] = s.serviceName;
    });
    return map;
  }, [services]);

  // Create a map for users
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

  // Create a map for therapists
  const therapistMap = useMemo(() => {
    const map = {};
    therapists.forEach((t) => {
      map[t.id] = t.fullName;
    });
    return map;
  }, [therapists]);

  // Create a map for vouchers
  const voucherMap = useMemo(() => {
    const map = {};
    vouchers.forEach((voucher) => {
      map[voucher.voucherId] = voucher.voucherName;
    });
    return map;
  }, [vouchers]);

  // Map service IDs to service names
  const getServiceNames = (serviceIds) => {
    if (!Array.isArray(serviceIds)) {
      return "Không có dịch vụ";
    }

    try {
      const serviceNames = serviceIds
        .map((id) => serviceMap[id])
        .filter(Boolean); // Remove undefined/null if not found

      return serviceNames.length > 0
        ? serviceNames.join(", ")
        : "Không có dịch vụ";
    } catch (error) {
      return "Lỗi hiển thị dịch vụ";
    }
  };

  // Get user full name and phone by userId
  const getUserDetails = (userId) => {
    const user = userMap[userId];
    if (!user) return { fullName: "Không có thông tin", phone: "N/A" };
    return user;
  };

  // Get therapist full name by therapistId
  const getTherapistName = (therapistId) => {
    return therapistMap[therapistId] || "Không có thông tin";
  };

  // Get voucher name by voucherId
  const getVoucherName = (voucherId) => {
    return voucherMap[voucherId] || "Không có voucher";
  };

  const handleCheckIn = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await onCheckIn(bookingId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleShowInvoice = (booking) => {
    setSelectedBooking(booking);
    setShowInvoice(true);
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
          <button
            className="action-btn checkin"
            onClick={() => handleCheckIn(booking.id)}
            title="Check-in"
          >
            <FaCheck />
          </button>
        );
      case "CHECKED_IN":
        return (
          <button
            className="action-btn complete"
            onClick={() => onComplete(booking.id)}
            title="Hoàn tất & In hóa đơn"
          >
            <FaPrint />
          </button>
        );
      case "IN_PROGRESS":
        return (
          <button
            className="action-btn invoice"
            onClick={() => handleShowInvoice(booking)}
            title="Xem hóa đơn"
          >
            <FaPrint />
          </button>
        );
      default:
        return null;
    }
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
                  <td>{format(new Date(booking.date), "dd/MM/yyyy")}</td>
                  <td>{booking.time}</td>
                  <td>
                    {booking.serviceId && booking.serviceId.length > 0 ? (
                      getServiceNames(booking.serviceId)
                    ) : (
                      <span className="no-data">Không có dịch vụ</span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${booking.status.toLowerCase()}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => onEdit(booking)}
                        disabled={
                          booking.status === "CANCELLED" ||
                          booking.status === "COMPLETED" ||
                          processingId === booking.id
                        }
                      >
                        <FaEdit />
                      </button>
                      {getActionButton(booking)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showInvoice && selectedBooking && (
        <InvoiceModal
          data={selectedBooking}
          onClose={() => {
            setShowInvoice(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </>
  );
};

export default BookingTable;
