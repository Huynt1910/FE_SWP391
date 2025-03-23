import React from "react";
import {
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaVenusMars,
} from "react-icons/fa";
import { useStaffInfo } from "@/auth/hook/admin/useStaffInfo";
import { format } from "date-fns";

const StaffProfile = () => {
  const { staffInfo, isLoading } = useStaffInfo();

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Thông tin cá nhân</h1>
      </div>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser size={60} />
          </div>
          <h2>{staffInfo.fullName}</h2>
          <span className="role-badge">{staffInfo.role}</span>
        </div>

        <div className="profile-content">
          <div className="info-group">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-text">
                <label>Tên đăng nhập</label>
                <p>{staffInfo.username}</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-text">
                <label>Email</label>
                <p>{staffInfo.email}</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhone className="info-icon" />
              <div className="info-text">
                <label>Số điện thoại</label>
                <p>{staffInfo.phone}</p>
              </div>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-text">
                <label>Địa chỉ</label>
                <p>{staffInfo.address}</p>
              </div>
            </div>

            <div className="info-item">
              <FaVenusMars className="info-icon" />
              <div className="info-text">
                <label>Giới tính</label>
                <p>{staffInfo.gender === "Male" ? "Nam" : "Nữ"}</p>
              </div>
            </div>

            <div className="info-item">
              <FaBirthdayCake className="info-icon" />
              <div className="info-text">
                <label>Ngày sinh</label>
                <p>{format(new Date(staffInfo.birthDate), "dd/MM/yyyy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
