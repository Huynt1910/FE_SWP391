import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const ServiceEditModal = ({ service, onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    category: "",
    price: "",
    duration: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || "",
        description: service.description || "",
        category: service.category || "",
        price: service.price || "",
        duration: service.duration || "",
      });
      setPreview(service.imgUrl || null); // Hiển thị hình ảnh hiện tại nếu có
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
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Hiển thị preview hình ảnh mới
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Thêm các trường vào FormData
    formDataToSend.append("serviceName", formData.serviceName || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("category", formData.category || "");
    formDataToSend.append("price", formData.price || "0");
    formDataToSend.append("duration", formData.duration || "00:00:00");

    // Xử lý hình ảnh
    if (selectedFile) {
      formDataToSend.append("imgUrl", selectedFile); // Thay đổi key thành imgUrl
    } else if (service.imgUrl) {
      // Tải file từ URL và thêm vào FormData
      const response = await fetch(service.imgUrl);
      const blob = await response.blob();
      const file = new File([blob], "current-image.jpg", { type: blob.type });
      formDataToSend.append("imgUrl", file); // Thay đổi key thành imgUrl
    }

    // Log dữ liệu trước khi gửi
    console.log("FormData to send:");
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value instanceof File ? value.name : value);
    }

    onConfirm(formDataToSend);
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
            <label htmlFor="category">Danh mục</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
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
            <label htmlFor="imgUrl">Hình ảnh</label>
            <input
              type="file"
              id="imgUrl"
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
