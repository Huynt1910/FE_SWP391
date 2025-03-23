import React, { useState } from "react";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { useStaffActions } from "@/auth/hook/admin/useStaffActions";
import StaffTable from "./Components/StaffTable";
import StaffEditModal from "./Components/StaffEditModal";
import StaffAddModal from "./Components/StaffAddModal";
import ResetPasswordModal from "./Components/ResetPasswordModal";

const Staffs = () => {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalState, setModalState] = useState({
    edit: false,
    add: false,
    resetPassword: false,
  });

  const {
    staffs,
    isLoading,
    createStaff,
    updateStaff,
    deactivateStaff,
    activateStaff,
    resetPassword,
  } = useStaffActions();

  const openModal = (type, staff = null) => {
    setSelectedStaff(staff);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setSelectedStaff(null);
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleToggleStatus = async (staff) => {
    const isActive = staff.status;
    const message = isActive
      ? "Bạn có chắc muốn ngưng hoạt động nhân viên này?"
      : "Bạn có chắc muốn khôi phục hoạt động nhân viên này?";

    if (window.confirm(message)) {
      try {
        await (isActive ? deactivateStaff(staff.id) : activateStaff(staff.id));
      } catch (error) {
        console.error("Error toggling staff status:", error);
      }
    }
  };

  const handleUpdateConfirm = async (data) => {
    try {
      await updateStaff({ id: selectedStaff.id, data });
      closeModal("edit");
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleAddConfirm = async (staffData) => {
    try {
      await createStaff(staffData);
      closeModal("add");
    } catch (error) {
      console.error("Error creating staff:", error);
    }
  };

  const handleResetPasswordConfirm = async (passwordData) => {
    try {
      await resetPassword({
        id: selectedStaff.id,
        data: passwordData,
      });
      closeModal("resetPassword");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý Nhân viên</h1>
          <p>Quản lý thông tin các nhân viên của spa</p>
        </div>
        <div className="admin-page__header-actions">
          <button className="btn btn-primary" onClick={() => openModal("add")}>
            <FaUserPlus /> Thêm Nhân viên
          </button>
        </div>
      </div>

      <StaffTable
        staffs={staffs || []}
        onEdit={(staff) => openModal("edit", staff)}
        onToggleStatus={handleToggleStatus}
        onResetPassword={(staff) => openModal("resetPassword", staff)}
      />

      {modalState.add && (
        <StaffAddModal
          onClose={() => closeModal("add")}
          onConfirm={handleAddConfirm}
        />
      )}

      {modalState.edit && selectedStaff && (
        <StaffEditModal
          staff={selectedStaff}
          onClose={() => closeModal("edit")}
          onConfirm={handleUpdateConfirm}
        />
      )}

      {modalState.resetPassword && selectedStaff && (
        <ResetPasswordModal
          staff={selectedStaff}
          onClose={() => closeModal("resetPassword")}
          onConfirm={handleResetPasswordConfirm}
        />
      )}
    </div>
  );
};

export default Staffs;
