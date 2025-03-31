import React from "react";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";

const VoucherTable = ({ vouchers, onEdit, onToggleStatus }) => {
  // Check if vouchers array is empty
  if (!vouchers || vouchers.length === 0) {
    return <div className="empty-message">Không có voucher nào</div>;
  }

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Tên Voucher</th>
            <th>Mã Voucher</th>
            <th>Giá trị</th>
            <th>Ngày hết hạn</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((voucher) => (
            <tr
              key={voucher.id}
              className={!voucher.isActive ? "inactive-row" : ""}
            >
              <td>{voucher.voucherName}</td>
              <td>{voucher.voucherCode}</td>
              <td>{voucher.percentDiscount}%</td>
              <td>{voucher.expiryDate || "N/A"}</td>{" "}
              {/* Hiển thị ngày hết hạn */}
              <td>{voucher.quantity || 0}</td> {/* Hiển thị số lượng */}
              <td>
                <span
                  className={`status-badge ${
                    voucher.isActive
                      ? "status-badge--active"
                      : "status-badge--inactive"
                  }`}
                >
                  {voucher.isActive ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    title="Chỉnh sửa"
                    onClick={() => onEdit(voucher)}
                  >
                    <FaEdit />
                  </button>
                  {voucher.isActive ? (
                    <button
                      className="delete-btn"
                      title="Ngưng hoạt động"
                      onClick={() => onToggleStatus(voucher)}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Khôi phục hoạt động"
                      onClick={() => onToggleStatus(voucher)}
                    >
                      <FaUserPlus />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;
