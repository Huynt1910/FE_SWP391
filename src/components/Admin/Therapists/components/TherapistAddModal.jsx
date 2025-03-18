import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/api-client/constantAdmin";
import { getCookie } from "cookies-next";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const TherapistAddModal = ({ onClose, onAdd }) => {
  const token = getCookie("token");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "Male",
    birthDate: "",
    yearExperience: 0,
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      // Append file if exists
      if (file) {
        submitData.append("imgUrl", file);
      }

      const response = await axios.post(`${API_URL}/therapists`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        toast.success("Thêm therapist thành công!");
        // Cleanup
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }
        onAdd && onAdd();
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="admin-page__modal">
      <div className="admin-page__modal-content">
        <div className="admin-page__modal-content-header">
          <h2>Thêm Therapist mới</h2>
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
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
              title="Tên đăng nhập phải từ 3-16 ký tự, chỉ bao gồm chữ cái, số, dấu gạch ngang và gạch dưới"
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
            <label>Mật khẩu</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
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

export default TherapistAddModal;
