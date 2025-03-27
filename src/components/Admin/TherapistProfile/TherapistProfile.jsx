import React from "react";
import { useTherapistProfile } from "@/auth/hook/admin/useTherapistProfile";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
  FaMedal,
} from "react-icons/fa";
import Image from "next/image";

export const TherapistProfile = () => {
  const { data: therapist, isLoading, error } = useTherapistProfile();

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
            src={therapist.imgUrl || "/default-avatar.png"}
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
    </div>
  );
};
