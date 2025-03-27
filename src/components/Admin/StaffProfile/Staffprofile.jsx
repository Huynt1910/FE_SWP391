import React, { useState } from "react";
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
import { useUpdateStaff } from "@/auth/hook/admin/useUpdateStaff";
import { useChangePassword } from "@/auth/hook/admin/useChangePasswordStaff"; // Sửa tên import
import UpdateStaffModal from "./UpdateStaffModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { toast } from "react-toastify";

const StaffProfile = () => {
  const { data: staffInfo, isLoading, error } = useStaffInfo();
  const updateStaff = useUpdateStaff();
  const changePassword = useChangePassword(); // Sửa tên biến

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStaff.mutateAsync({
        staffId: staffInfo.id,
        data: updateData,
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
      await changePassword.mutateAsync(passwordData); // Sử dụng đúng biến
      toast.success("Đổi mật khẩu thành công!");
      setIsPasswordModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Lỗi khi đổi mật khẩu");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
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
    <div className="admin-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser size={80} />
          </div>
          <h2 className="profile-name">{staffInfo.fullName}</h2>
          <span className="profile-role">{staffInfo.role}</span>
        </div>

        <div className="profile-content">
          <div className="info-group">
            <div className="info-item">
              <FaUser className="info-icon" />
              <div className="info-text">
                <label className="info-label">Tên đăng nhập</label>
                <p className="info-value">{staffInfo.username}</p>
              </div>
            </div>

            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <div className="info-text">
                <label className="info-label">Email</label>
                <p className="info-value">{staffInfo.email}</p>
              </div>
            </div>

            <div className="info-item">
              <FaPhone className="info-icon" />
              <div className="info-text">
                <label className="info-label">Số điện thoại</label>
                <p className="info-value">{staffInfo.phone}</p>
              </div>
            </div>

            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div className="info-text">
                <label className="info-label">Địa chỉ</label>
                <p className="info-value">{staffInfo.address}</p>
              </div>
            </div>

            <div className="info-item">
              <FaVenusMars className="info-icon" />
              <div className="info-text">
                <label className="info-label">Giới tính</label>
                <p className="info-value">
                  {staffInfo.gender === "Male" ? "Nam" : "Nữ"}
                </p>
              </div>
            </div>

            <div className="info-item">
              <FaBirthdayCake className="info-icon" />
              <div className="info-text">
                <label className="info-label">Ngày sinh</label>
                <p className="info-value">
                  {new Date(staffInfo.birthDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setUpdateData({
                fullName: staffInfo.fullName || "",
                email: staffInfo.email || "",
                phone: staffInfo.phone || "",
                address: staffInfo.address || "",
                gender: staffInfo.gender || "",
                birthDate: staffInfo.birthDate || "",
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

        {/* Import và sử dụng modal */}
        <UpdateStaffModal
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
    </div>
  );
};

export default StaffProfile;
