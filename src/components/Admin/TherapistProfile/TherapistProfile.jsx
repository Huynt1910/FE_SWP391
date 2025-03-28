import React, { useState } from "react";
import { useTherapistProfile } from "@/auth/hook/admin/useTherapistProfile";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";
import UpdateTherapistModal from "./UpdateTherapistModal";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaMedal,
} from "react-icons/fa";
import Image from "next/image";
import { toast } from "react-toastify";

export const TherapistProfile = () => {
  const { data: therapist, isLoading, error } = useTherapistProfile();
  const { updateTherapist } = useTherapistActions();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
    yearExperience: "",
    imgUrl: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateSubmit = async (formData) => {
    try {
      await updateTherapist({
        id: therapist.id,
        formData,
      });
      toast.success("Cập nhật thông tin thành công!");
      setIsUpdateModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Lỗi khi cập nhật thông tin");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      // Logic đổi mật khẩu (giữ nguyên như cũ)
      toast.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Lỗi khi đổi mật khẩu");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Có lỗi xảy ra khi tải thông tin</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <Image
            src={therapist.imgUrl || "/default-avatar.png"} // Hiển thị hình ảnh từ server hoặc hình mặc định
            alt={therapist.fullName}
            width={150}
            height={150}
            className="avatar-image"
          />
        </div>
        <h2>{therapist.fullName}</h2>
        <span className="role-badge">Therapist</span>
      </div>

      <div className="profile-content">
        <div className="info-group">
          <div className="info-item">
            <FaEnvelope className="info-icon" />
            <div className="info-text">
              <label>Email</label>
              <p>{therapist.email}</p>
            </div>
          </div>
          <div className="info-item">
            <FaPhone className="info-icon" />
            <div className="info-text">
              <label>Số điện thoại</label>
              <p>{therapist.phone}</p>
            </div>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="info-icon" />
            <div className="info-text">
              <label>Địa chỉ</label>
              <p>{therapist.address}</p>
            </div>
          </div>
          <div className="info-item">
            <FaVenusMars className="info-icon" />
            <div className="info-text">
              <label>Giới tính</label>
              <p>{therapist.gender}</p>
            </div>
          </div>
          <div className="info-item">
            <FaBirthdayCake className="info-icon" />
            <div className="info-text">
              <label>Ngày sinh</label>
              <p>{new Date(therapist.birthDate).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
          <div className="info-item">
            <FaMedal className="info-icon" />
            <div className="info-text">
              <label>Kinh nghiệm</label>
              <p>{therapist.yearExperience} năm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            setUpdateData({
              fullName: therapist.fullName || "",
              email: therapist.email || "",
              phone: therapist.phone || "",
              address: therapist.address || "",
              gender: therapist.gender || "",
              birthDate: therapist.birthDate || "",
              yearExperience: therapist.yearExperience || "",
              imgUrl: therapist.imgUrl || "",
            });
            setIsUpdateModalOpen(true);
          }}
        >
          Cập nhật thông tin
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setIsPasswordModalOpen(true)}
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* Modals */}
      <UpdateTherapistModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        updateData={updateData}
        setUpdateData={setUpdateData}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
      />
    </div>
  );
};
