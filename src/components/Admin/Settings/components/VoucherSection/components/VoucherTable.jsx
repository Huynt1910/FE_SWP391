import React from "react";
import { FaEdit, FaTrash, FaCheckCircle, FaBan } from "react-icons/fa";

const VoucherTable = ({ vouchers, onEdit, onActivate, onDeactivate }) => {
  if (!vouchers?.result || vouchers.result.length === 0) {
    return <div className="empty-message">Không có voucher nào</div>;
  }

  return (
    <div className="admin-page__table">
      <table>
        <thead>
          <tr>
            <th>Tên voucher</th>
            <th>Mã voucher</th>
            <th>Giảm giá (%)</th>
            <th>Số lượng</th>
            <th>Ngày hết hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.result.map((voucher) => (
            <tr key={voucher.id}>
              <td>{voucher.voucherName}</td>
              <td>{voucher.voucherCode}</td>
              <td>{voucher.percentDiscount}%</td>
              <td>{voucher.quantity}</td>
              <td>
                {new Date(voucher.expiryDate).toLocaleDateString("vi-VN")}
              </td>
              <td>
                <span
                  className={`status-badge status-badge--${
                    voucher.isActive ? "active" : "inactive"
                  }`}
                >
                  {voucher.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
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
                      title="Ngưng kích hoạt"
                      onClick={() => onDeactivate(voucher.id)}
                    >
                      <FaBan />
                    </button>
                  ) : (
                    <button
                      className="restore-btn"
                      title="Kích hoạt"
                      onClick={() => onActivate(voucher.id)}
                    >
                      <FaCheckCircle />
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
