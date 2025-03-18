import React from "react";
import { FaSpinner } from "react-icons/fa";

const EditVoucherModal = ({
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
          <h2>Chỉnh sửa Voucher</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          {/* Same form fields as AddVoucherModal */}
          <div className="form-group">
            <label>Trạng thái:</label>
            <select
              name="isActive"
              value={voucherForm.isActive}
              onChange={onChange}
            >
              <option value={true}>Đang hoạt động</option>
              <option value={false}>Không hoạt động</option>
            </select>
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
                "Lưu thay đổi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucherModal;
