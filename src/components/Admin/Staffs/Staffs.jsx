import React, { useState } from "react";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { useStaffActions } from "@/auth/hook/admin/useStaffActions";
import StaffTabs from "./components/StaffTabs";
import StaffTable from "./components/StaffTable";
import StaffEditModal from "./components/StaffEditModal";
import StaffAddModal from "./components/StaffAddModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import { toast } from "react-toastify";

const Staffs = () => {
  const {
    useGetAllStaffs,
    useGetActiveStaffs,
    useGetInactiveStaffs,
    useDeleteStaff,
    useRestoreStaff,
    useResetPassword,
    useUpdateStaff,
  } = useStaffActions();

  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const { mutateAsync: resetPassword, isLoading: isResetting } =
    useResetPassword();
  const { mutateAsync: updateStaff, isLoading: isUpdating } = useUpdateStaff();
  const { mutateAsync: deleteStaff } = useDeleteStaff();
  const { mutateAsync: restoreStaff } = useRestoreStaff();

  const { data: allStaffs, isLoading: loadingAll } = useGetAllStaffs();
  const { data: activeStaffs, isLoading: loadingActive } = useGetActiveStaffs();
  const { data: inactiveStaffs, isLoading: loadingInactive } =
    useGetInactiveStaffs();

  const isLoading = loadingAll || loadingActive || loadingInactive;

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn ngưng hoạt động nhân viên này?")) {
      try {
        await deleteStaff(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("Bạn có chắc muốn khôi phục hoạt động nhân viên này?")) {
      try {
        await restoreStaff(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleResetPasswordClick = (staff) => {
    setSelectedStaff(staff);
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordConfirm = async (passwordData) => {
    try {
      await resetPassword({
        id: selectedStaff.id,
        data: {
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
      });
      setShowResetPasswordModal(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateConfirm = async (id, data) => {
    try {
      await updateStaff({ id, data });
      setShowEditModal(false);
      setSelectedStaff(null);
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentStaffs = () => {
    switch (activeTab) {
      case "ACTIVE":
        return activeStaffs || [];
      case "INACTIVE":
        return inactiveStaffs || [];
      default:
        return allStaffs || [];
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
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaUserPlus /> Thêm Nhân viên
          </button>
        </div>
      </div>

      <StaffTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          all: allStaffs?.length || 0,
          active: activeStaffs?.length || 0,
          inactive: inactiveStaffs?.length || 0,
        }}
      />

      <StaffTable
        staffs={getCurrentStaffs()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onResetPassword={handleResetPasswordClick}
      />

      {showAddModal && (
        <StaffAddModal
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedStaff && (
        <StaffEditModal
          staff={selectedStaff}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
          onConfirm={handleUpdateConfirm}
          isLoading={isUpdating}
        />
      )}

      {showResetPasswordModal && selectedStaff && (
        <ResetPasswordModal
          staff={selectedStaff}
          onClose={() => {
            setShowResetPasswordModal(false);
            setSelectedStaff(null);
          }}
          onConfirm={handleResetPasswordConfirm}
          isLoading={isResetting}
        />
      )}
    </div>
  );
};

export default Staffs;
