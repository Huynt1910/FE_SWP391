import React, { useState } from "react";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";
import { toast } from "react-toastify";
import TherapistTable from "./components/TherapistTable";
import TherapistAddModal from "./components/TherapistAddModal";
import TherapistEditModal from "./components/TherapistEditModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

const Therapists = () => {
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [modalState, setModalState] = useState({
    edit: false,
    add: false,
    resetPassword: false,
  });

  const {
    therapists,
    isLoading,
    createTherapist,
    updateTherapist, // Sử dụng chức năng cập nhật
    deleteTherapist,
    restoreTherapist,
  } = useTherapistActions();

  const openModal = (type, therapist = null) => {
    setSelectedTherapist(therapist);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setSelectedTherapist(null);
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleUpdateConfirm = async (formData) => {
    try {
      await updateTherapist({
        id: selectedTherapist.id,
        formData,
      });
      toast.success("Cập nhật nhân viên thành công!");
      closeModal("edit");
    } catch (error) {
      toast.error("Lỗi cập nhật nhân viên!");
      console.error("Error updating therapist:", error);
    }
  };

  const handleAddConfirm = async (therapistData) => {
    try {
      await createTherapist(therapistData);
      toast.success("Thêm nhân viên thành công!");
      closeModal("add");
    } catch (error) {
      toast.error("Lỗi thêm nhân viên!");
      console.error("Error creating therapist:", error);
    }
  };

  const handleToggleStatus = async (therapist) => {
    const isActive = therapist.status;
    const message = isActive
      ? "Bạn có chắc muốn ngưng hoạt động nhân viên này?"
      : "Bạn có chắc muốn kích hoạt nhân viên này?";

    if (window.confirm(message)) {
      try {
        await (isActive
          ? deleteTherapist(therapist.id)
          : restoreTherapist(therapist.id));
        toast.success(
          `${isActive ? "Ngưng hoạt động" : "Kích hoạt"} nhân viên thành công!`
        );
      } catch (error) {
        toast.error(
          `Lỗi ${isActive ? "ngưng hoạt động" : "kích hoạt"} nhân viên!`
        );
        console.error("Error toggling therapist status:", error);
      }
    }
  };

  const handleResetPasswordConfirm = async (passwordData) => {
    try {
      await resetPassword({
        id: selectedTherapist.id,
        data: passwordData,
      });
      closeModal("resetPassword");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

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
        <div className="admin-page__header-title">
          <h1>Quản lý Nhân viên</h1>
          <p>Quản lý và cập nhật thông tin nhân viên</p>
        </div>
        <div className="admin-page__header-actions">
          <button className="btn btn-primary" onClick={() => openModal("add")}>
            <FaUserPlus className="btn-icon" />
            Thêm Nhân viên
          </button>
        </div>
      </div>

      <TherapistTable
        therapists={therapists}
        onEdit={(therapist) => openModal("edit", therapist)}
        onToggleStatus={handleToggleStatus}
      />

      {modalState.add && (
        <TherapistAddModal
          onClose={() => closeModal("add")}
          onConfirm={handleAddConfirm}
        />
      )}

      {modalState.edit && selectedTherapist && (
        <TherapistEditModal
          therapist={selectedTherapist}
          onClose={() => closeModal("edit")}
          onConfirm={handleUpdateConfirm} // Truyền hàm xử lý cập nhật
        />
      )}

      {modalState.resetPassword && selectedTherapist && (
        <ResetPasswordModal
          therapist={selectedTherapist}
          onClose={() => closeModal("resetPassword")}
          onConfirm={handleResetPasswordConfirm}
        />
      )}
    </div>
  );
};

export default Therapists;
