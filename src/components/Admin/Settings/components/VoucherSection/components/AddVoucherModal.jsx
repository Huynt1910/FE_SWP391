import React from "react";
import { FaSpinner } from "react-icons/fa";

const AddVoucherModal = ({
  voucherForm,
  onSubmit,
  onChange,
  onClose,
  isLoading,
}) => {
  return (
    <div className="admin-page__modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Thêm Voucher mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Tên voucher:</label>
            <input
              type="text"
              name="voucherName"
              value={voucherForm.voucherName}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mã voucher:</label>
            <input
              type="text"
              name="voucherCode"
              value={voucherForm.voucherCode}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phần trăm giảm giá:</label>
            <input
              type="number"
              name="percentDiscount"
              value={voucherForm.percentDiscount}
              onChange={onChange}
              required
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Số lượng:</label>
            <input
              type="number"
              name="quantity"
              value={voucherForm.quantity}
              onChange={onChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Ngày hết hạn:</label>
            <input
              type="date"
              name="expiryDate"
              value={voucherForm.expiryDate}
              onChange={onChange}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
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
                "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVoucherModal;
