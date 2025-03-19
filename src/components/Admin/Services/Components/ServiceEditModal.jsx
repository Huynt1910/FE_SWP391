import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const ServiceEditModal = ({ service, onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    price: "",
    duration: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || "",
        description: service.description || "",
        price: service.price || "",
        duration: service.duration || "",
      });
      setPreview(service.imgUrl);
    }
  }, [service]);

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

    // Log the data before sending
    console.log("Form data before submit:", formData);

    // Add each field with the correct key name
    submitData.append("serviceName", formData.serviceName);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("duration", formData.duration);

    // Only append image if a new one is selected
    if (image) {
      submitData.append("image", image);
    }

    // Log the FormData entries
    for (let pair of submitData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    onConfirm(service.serviceId, submitData);
  };

  return (
    <div className="admin-page__modal-overlay">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-header">
          <h2>Chỉnh sửa Dịch vụ</h2>
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
                "Cập nhật"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceEditModal;
