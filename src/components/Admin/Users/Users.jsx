import React, { useState } from "react";
import { useGetAllUsers } from "@/auth/hook/admin/useGetAllUsersHook";
import { useGetAllTherapists } from "@/auth/hook/admin/useGetAllTherapistHook";
import { useGetAllStaffs } from "@/auth/hook/admin/useGetAllStaffsHook";
import { FaSpinner, FaUserPlus } from "react-icons/fa";

import { UserTable } from "./components/UserTable";
import { UserViewModal } from "./components/UserViewModal";
import { UserTabs } from "./Components/UsersTabs";
import { UserAddModal } from "./Components/UserAddModal";

const Users = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetAllUsers();
  const {
    data: therapists,
    isLoading: therapistsLoading,
    error: therapistsError,
  } = useGetAllTherapists();
  const {
    data: staffs,
    isLoading: staffsLoading,
    error: staffsError,
  } = useGetAllStaffs();
  const [activeTab, setActiveTab] = useState("CUSTOMER");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Combine and filter data based on active tab
  const getFilteredData = () => {
    switch (activeTab) {
      case "THERAPIST":
        return therapists || [];
      case "CUSTOMER":
        return users?.filter((user) => user.role === "CUSTOMER") || [];
      case "STAFF":
        return staffs || [];
      default:
        return [];
    }
  };

  const isLoading = usersLoading || therapistsLoading || staffsLoading;
  const error = usersError || therapistsError || staffsError;

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page__error">
        <p>Có lỗi xảy ra: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý người dùng</h1>
          <p>Quản lý thông tin và phân quyền người dùng</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaUserPlus /> Thêm người dùng
          </button>
        </div>
      </div>

      <UserTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          CUSTOMER: users?.filter((u) => u.role === "CUSTOMER").length || 0,
          THERAPIST: therapists?.length || 0,
          STAFF: staffs?.length || 0,
        }}
      />

      <UserTable
        users={getFilteredData()}
        onView={handleView}
        onEdit={() => {}}
        onDelete={() => {}}
      />

      {showViewModal && (
        <UserViewModal
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showAddModal && (
        <UserAddModal role={activeTab} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Users;
