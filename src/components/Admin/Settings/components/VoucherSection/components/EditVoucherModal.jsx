import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const EditVoucherModal = ({ voucher, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    quantity: "",
    expiryDate: "",
    description: "",
  });

  useEffect(() => {
    if (voucher) {
      // Format the date to YYYY-MM-DD for the date input
      const formattedDate = voucher.expiryDate
        ? new Date(voucher.expiryDate).toISOString().split("T")[0]
        : "";

      setFormData({
        code: voucher.code || "",
        value: voucher.value || 0,
        quantity: voucher.quantity || 0,
        expiryDate: formattedDate,
        description: voucher.description || "",
      });
    }
  }, [voucher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Include voucher ID in the update data
      const updateData = {
        ...formData,
        id: voucher.id, // Make sure to include the ID for updating
      };
      await onConfirm(updateData);
      onClose();
    } catch (error) {
      console.error("Error updating voucher:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add validation for expiry date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa Voucher: {voucher.code}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Mã Voucher</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              disabled
              className="input-disabled"
            />
          </div>

          <div className="form-group">
            <label>Giá trị (%)</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Ngày hết hạn</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Nhập mô tả voucher..."
            />
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" /> Đang xử lý...
                </>
              ) : (
                "Cập nhật"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVoucherModal;
