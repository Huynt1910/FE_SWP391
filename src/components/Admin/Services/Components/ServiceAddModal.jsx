import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const ServiceAddModal = ({ onClose, onAdd, isLoading }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
    duration: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();

    // Ensure all required fields are present with correct keys
    submitData.append("serviceName", formData.serviceName.trim());
    submitData.append("description", formData.description.trim());
    submitData.append("price", formData.price.toString());
    submitData.append("duration", formData.duration.trim());
    submitData.append("isActive", "true"); // Add isActive field

    if (image) {
      submitData.append("image", image);
    }

    // Debug log
    console.log("Submitting form data:");
    for (let pair of submitData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    onAdd(submitData);
  };

  return (
    <div className="admin-page__modal-overlay">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-header">
          <h2>Thêm Dịch vụ mới</h2>
          <button className="admin-page__modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="admin-page__form">
          <div className="admin-page__form-group">
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

          <div className="admin-page__form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-page__form-group">
            <label htmlFor="price">Giá (VNĐ)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-page__form-group">
            <label htmlFor="duration">Thời gian (HH:mm:ss)</label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="00:00:00"
              pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
              required
            />
          </div>

          <div className="admin-page__form-group">
            <label htmlFor="image">Hình ảnh</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="admin-page__modal-footer">
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

export default ServiceAddModal;
