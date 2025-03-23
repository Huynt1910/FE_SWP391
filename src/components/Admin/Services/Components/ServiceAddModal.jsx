import React, { useState } from "react";
import { FaSpinner, FaUpload } from "react-icons/fa";

const ServiceAddModal = ({ onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    category: "",
    price: "",
    duration: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("serviceName", formData.serviceName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category || "");
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("isActive", "true");

      // Add file last
      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      // Log what's being sent
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      await onConfirm(formDataToSend);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Lỗi thêm dịch vụ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Thêm Dịch vụ mới</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label htmlFor="serviceName">Tên dịch vụ</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Phân loại</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá (VNĐ)</label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="1000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">Thời gian (HH:mm:ss)</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Hình ảnh</label>
            <div className="image-upload">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="image" className="file-label">
                <FaUpload /> Chọn ảnh
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
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

export default ServiceAddModal;
