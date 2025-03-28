import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const TherapistEditModal = ({ therapist, onClose, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    birthDate: "",
    yearExperience: "",
    imgUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Load thông tin therapist khi mở modal
  useEffect(() => {
    if (therapist) {
      setFormData({
        fullName: therapist.fullName || "",
        email: therapist.email || "",
        phone: therapist.phone || "",
        address: therapist.address || "",
        gender: therapist.gender || "Male",
        birthDate: therapist.birthDate?.split("T")[0] || "",
        yearExperience: therapist.yearExperience || "",
      });

      // Hiển thị hình ảnh hiện tại nếu có
      setImagePreview(therapist.imgUrl || null);
    }
  }, [therapist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Hiển thị preview hình ảnh mới
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
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
      formDataToSend.append("fullName", formData.fullName || "");
      formDataToSend.append("email", formData.email || "");
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("address", formData.address || "");
      formDataToSend.append("gender", formData.gender || "Male");
      formDataToSend.append("birthDate", formData.birthDate || "");
      formDataToSend.append("yearExperience", formData.yearExperience || "0");

      if (selectedFile) {
        formDataToSend.append("imgUrl", selectedFile); // Gửi hình ảnh mới nếu có
      } else if (therapist.imgUrl) {
        // Tải file từ URL và thêm vào FormData
        const response = await fetch(therapist.imgUrl);
        const blob = await response.blob();
        const file = new File([blob], "current-image.jpg", { type: blob.type });
        formDataToSend.append("imgUrl", file);
      }

      // Log dữ liệu FormData
      console.log("FormData to send:");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      await onConfirm(formDataToSend);
      onClose();
    } catch (error) {
      console.error("Error updating therapist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa thông tin Nhân viên</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Kinh nghiệm (năm)</label>
            <input
              type="number"
              name="yearExperience"
              value={formData.yearExperience}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
            <input type="file" onChange={handleFileChange} />
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

export default TherapistEditModal;
