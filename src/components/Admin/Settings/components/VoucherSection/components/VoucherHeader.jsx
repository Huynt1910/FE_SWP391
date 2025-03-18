import React from "react";
import { FaPlus, FaTicketAlt } from "react-icons/fa";

const VoucherHeader = ({ onAddClick }) => {
  return (
    <div className="admin-page__header">
      <div className="admin-page__header-title">
        <h1>Quản lý Voucher</h1>
        <p>Quản lý và cập nhật các mã giảm giá</p>
      </div>
      <div className="admin-page__header-actions">
        <button className="btn btn-primary" onClick={onAddClick}>
          <FaPlus /> Thêm Voucher mới
        </button>
      </div>
      <div className="admin-page__header-icon">
        <FaTicketAlt />
      </div>
    </div>
  );
};

export default VoucherHeader;
