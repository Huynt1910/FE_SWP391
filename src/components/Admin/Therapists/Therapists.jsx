import React, { useState } from "react";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions";
import TherapistTabs from "./components/TherapistTabs";
import TherapistTable from "./components/TherapistTable";
import TherapistEditModal from "./components/TherapistEditModal";
import TherapistAddModal from "./components/TherapistAddModal";
import ResetPasswordModal from "./components/ResetPasswordModal";

import { toast } from "react-toastify";

const Therapists = () => {
  const {
    useGetAllTherapists,
    useGetActiveTherapists,
    useGetInactiveTherapists,
    useDeleteTherapist,
    useRestoreTherapist,
    useResetPassword,
    useUpdateTherapist,
  } = useTherapistActions();

  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const { mutateAsync: resetPassword, isLoading: isResetting } =
    useResetPassword();
  const { mutateAsync: updateTherapist, isLoading: isUpdating } =
    useUpdateTherapist();
  const { mutateAsync: deleteTherapist } = useDeleteTherapist();
  const { mutateAsync: restoreTherapist } = useRestoreTherapist();

  // Fetch data based on tabs
  const { data: allTherapists, isLoading: loadingAll } = useGetAllTherapists();
  const { data: activeTherapists, isLoading: loadingActive } =
    useGetActiveTherapists();
  const { data: inactiveTherapists, isLoading: loadingInactive } =
    useGetInactiveTherapists();

  const isLoading = loadingAll || loadingActive || loadingInactive;

  const handleEdit = (therapist) => {
    setSelectedTherapist(therapist);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn ngưng hoạt động therapist này?")) {
      try {
        await deleteTherapist(id);
        toast.success("Đã ngưng hoạt động therapist thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra!");
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("Bạn có chắc muốn khôi phục hoạt động therapist này?")) {
      try {
        await restoreTherapist(id);
        toast.success("Đã khôi phục hoạt động therapist thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra!");
      }
    }
  };

  const handleResetPasswordClick = (therapist) => {
    setSelectedTherapist(therapist);
    setShowResetPasswordModal(true);
  };

  // Fix the handleResetPasswordConfirm function
  const handleResetPasswordConfirm = async (passwordData) => {
    try {
      console.log("Selected Therapist:", selectedTherapist); // For debugging
      await resetPassword({
        id: selectedTherapist.id, // Use the id from API response
        data: {
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
      });
      setShowResetPasswordModal(false);
      setSelectedTherapist(null);
    } catch (error) {
      console.error("Reset password error:", error); // For debugging
      toast.error("Có lỗi xảy ra khi đặt lại mật khẩu!");
    }
  };

  const handleUpdateConfirm = async (id, data) => {
    try {
      await updateTherapist({ id, data });
      setShowEditModal(false);
      setSelectedTherapist(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const getCurrentTherapists = () => {
    switch (activeTab) {
      case "ACTIVE":
        return activeTherapists || [];
      case "INACTIVE":
        return inactiveTherapists || [];
      default:
        return allTherapists || [];
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
          <h1>Quản lý Therapist</h1>
          <p>Quản lý thông tin các therapist của spa</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaUserPlus /> Thêm Therapist
          </button>
        </div>
      </div>

      <TherapistTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          all: allTherapists?.length || 0,
          active: activeTherapists?.length || 0,
          inactive: inactiveTherapists?.length || 0,
        }}
      />

      <TherapistTable
        therapists={getCurrentTherapists()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onResetPassword={handleResetPasswordClick}
        showInactive={activeTab === "INACTIVE"}
      />

      {showAddModal && (
        <TherapistAddModal
          onClose={() => setShowAddModal(false)}
          onAdd={() => {
            setShowAddModal(false);
            // Refresh only necessary data
            queryClient.invalidateQueries(["therapists"]);
            queryClient.invalidateQueries(["activeTherapists"]);
          }}
        />
      )}

      {showEditModal && selectedTherapist && (
        <TherapistEditModal
          therapist={selectedTherapist}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTherapist(null);
          }}
          onConfirm={handleUpdateConfirm}
          isLoading={isUpdating}
        />
      )}

      {showResetPasswordModal && selectedTherapist && (
        <ResetPasswordModal
          therapist={selectedTherapist}
          onClose={() => {
            setShowResetPasswordModal(false);
            setSelectedTherapist(null);
          }}
          onConfirm={handleResetPasswordConfirm}
          isLoading={isResetting}
        />
      )}
    </div>
  );
};

export default Therapists;
