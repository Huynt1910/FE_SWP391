import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

const TherapistEditModal = ({ therapist, onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    birthDate: "",
    yearExperience: 0,
    imgUrl: "",
  });

  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (therapist) {
      setFormData({
        fullName: therapist.fullName || "",
        email: therapist.email || "",
        phone: therapist.phone || "",
        address: therapist.address || "",
        gender: therapist.gender || "Male",
        birthDate: therapist.birthDate?.split("T")[0] || "",
        yearExperience: therapist.yearExperience || 0,
        imgUrl: therapist.imgUrl || "",
      });
      setImagePreview(therapist.imgUrl);
    }
  }, [therapist]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ!");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    // Create FormData object
    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "imgUrl") {
        submitData.append(key, formData[key]);
      }
    });

    // Append file if new image is selected
    if (file) {
      submitData.append("imgUrl", file);
    }

    onConfirm(therapist.id, submitData);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview !== therapist.imgUrl) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, therapist.imgUrl]);

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Chỉnh sửa thông tin Therapist</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="admin-page__modal-content-body"
        >
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Giới tính</label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ngày sinh</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Số năm kinh nghiệm</label>
            <input
              type="number"
              min="0"
              value={formData.yearExperience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearExperience: parseInt(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Hình ảnh</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
              />
              {imagePreview && (
                <div className="image-preview">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      marginTop: "10px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="admin-page__modal-content-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
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

export default TherapistEditModal;
