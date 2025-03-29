import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const EditVoucherModal = ({ voucher, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    voucherName: "",
    voucherCode: "",
    percentDiscount: "",
    quantity: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (!voucher) {
      console.error("Voucher is null or undefined in EditVoucherModal");
      return;
    }

    setFormData({
      voucherName: voucher.voucherName || "",
      voucherCode: voucher.voucherCode || "",
      percentDiscount: voucher.percentDiscount || "",
      quantity: voucher.quantity || "",
      expiryDate: voucher.expiryDate || "",
    });
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
      const updateData = {
        ...formData,
        percentDiscount: parseFloat(formData.percentDiscount),
        quantity: parseInt(formData.quantity),
      };
      console.log("Data to send to API:", updateData);
      await onConfirm(updateData);
    } catch (error) {
      console.error("Error updating voucher:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa Voucher</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Tên Voucher</label>
            <input
              type="text"
              name="voucherName"
              value={formData.voucherName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mã Voucher</label>
            <input
              type="text"
              name="voucherCode"
              value={formData.voucherCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Giá trị (%)</label>
            <input
              type="number"
              name="percentDiscount"
              value={formData.percentDiscount}
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
