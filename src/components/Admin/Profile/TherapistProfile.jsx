import React from "react";
import { useTherapistProfile } from "@/auth/hook/useTherapistProfile";
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaMedal,
} from "react-icons/fa";
import Image from "next/image";

export const TherapistProfile = () => {
  const { data: profile, isLoading, error } = useTherapistProfile();

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page__error">
        <p>Có lỗi xảy ra khi tải thông tin</p>
      </div>
    );
  }

  const therapist = profile?.result;

  return (
    <div className="admin-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <Image
              src={therapist.imgUrl || "/default-avatar.png"}
              alt={therapist.fullName}
              width={150}
              height={150}
              className="avatar-image"
            />
          </div>
          <div className="profile-title">
            <h1>{therapist.fullName}</h1>
            <span className="role-badge">{therapist.role}</span>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h2>Thông tin cá nhân</h2>
            <div className="info-grid">
              <div className="info-item">
                <FaUser className="info-icon" />
                <div className="info-content">
                  <label>Tên đăng nhập</label>
                  <span>{therapist.username}</span>
                </div>
              </div>

              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div className="info-content">
                  <label>Email</label>
                  <span>{therapist.email}</span>
                </div>
              </div>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div className="info-content">
                  <label>Số điện thoại</label>
                  <span>{therapist.phone}</span>
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div className="info-content">
                  <label>Địa chỉ</label>
                  <span>{therapist.address}</span>
                </div>
              </div>

              <div className="info-item">
                <FaVenusMars className="info-icon" />
                <div className="info-content">
                  <label>Giới tính</label>
                  <span>{therapist.gender}</span>
                </div>
              </div>

              <div className="info-item">
                <FaBirthdayCake className="info-icon" />
                <div className="info-content">
                  <label>Ngày sinh</label>
                  <span>
                    {new Date(therapist.birthDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              <div className="info-item">
                <FaMedal className="info-icon" />
                <div className="info-content">
                  <label>Kinh nghiệm</label>
                  <span>{therapist.yearExperience} năm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
