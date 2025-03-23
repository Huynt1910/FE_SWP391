import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const AddVoucherModal = ({ onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    voucherName: "",
    voucherCode: "",
    percentDiscount: "",
    quantity: "",
    expiryDate: "",
  });

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
      const dataToSubmit = {
        ...formData,
        percentDiscount: parseFloat(formData.percentDiscount),
        quantity: parseInt(formData.quantity),
        isActive: true,
      };
      await onConfirm(dataToSubmit);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Thêm Voucher mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label htmlFor="voucherName">Tên Voucher</label>
            <input
              type="text"
              id="voucherName"
              name="voucherName"
              value={formData.voucherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="voucherCode">Mã Voucher</label>
            <input
              type="text"
              id="voucherCode"
              name="voucherCode"
              value={formData.voucherCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="percentDiscount">Giá trị (%)</label>
            <input
              type="number"
              id="percentDiscount"
              name="percentDiscount"
              value={formData.percentDiscount}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Số lượng</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Ngày hết hạn</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              required
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
                "Thêm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVoucherModal;
