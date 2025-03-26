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
      <div className="admin-page__loading">
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

  return (
    <div className="therapist-profile">
      <div className="profile-card">
        {/* Cột trái */}
        <div className="profile-card__left">
          <div className="profile-avatar">
            <Image
              src={therapist.imgUrl || "/default-avatar.png"}
              alt={therapist.fullName}
              width={150}
              height={150}
              className="avatar-image"
            />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{therapist.fullName}</h1>
            <span className="profile-role">Therapist</span>
          </div>
        </div>

        {/* Cột phải */}
        <div className="profile-card__right">
          <div className="profile-details">
            <div className="detail-item">
              <FaEnvelope className="detail-icon" />
              <div>
                <label>Email</label>
                <span>{therapist.email}</span>
              </div>
            </div>
            <div className="detail-item">
              <FaPhone className="detail-icon" />
              <div>
                <label>Số điện thoại</label>
                <span>{therapist.phone}</span>
              </div>
            </div>
            <div className="detail-item">
              <FaMapMarkerAlt className="detail-icon" />
              <div>
                <label>Địa chỉ</label>
                <span>{therapist.address}</span>
              </div>
            </div>
            <div className="detail-item">
              <FaVenusMars className="detail-icon" />
              <div>
                <label>Giới tính</label>
                <span>{therapist.gender}</span>
              </div>
            </div>
            <div className="detail-item">
              <FaBirthdayCake className="detail-icon" />
              <div>
                <label>Ngày sinh</label>
                <span>
                  {new Date(therapist.birthDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
            <div className="detail-item">
              <FaMedal className="detail-icon" />
              <div>
                <label>Kinh nghiệm</label>
                <span>{therapist.yearExperience} năm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
