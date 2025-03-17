import React, { useState } from "react";
import { FaSpinner, FaUserPlus } from "react-icons/fa";
import { useCustomerActions } from "@/auth/hook/admin/useCustomerActions";
import CustomerTabs from "./components/CustomerTabs";
import CustomerTable from "./components/CustomerTable";
import CustomerAddModal from "./components/CustomerAddModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import { toast } from "react-toastify";

const Customers = () => {
  const {
    useGetAllCustomers,
    useGetActiveCustomers,
    useGetInactiveCustomers,
    useDeactivateCustomer,
    useActivateCustomer,
    useAddCustomer,
    useResetCustomerPassword,
  } = useCustomerActions();

  const [activeTab, setActiveTab] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: allCustomers, isLoading: loadingAll } = useGetAllCustomers();
  const { data: activeCustomers, isLoading: loadingActive } =
    useGetActiveCustomers();
  const { data: inactiveCustomers, isLoading: loadingInactive } =
    useGetInactiveCustomers();

  const { mutateAsync: deactivateCustomer } = useDeactivateCustomer();
  const { mutateAsync: activateCustomer } = useActivateCustomer();
  const { mutateAsync: addCustomer, isLoading: isAdding } = useAddCustomer();
  const { mutateAsync: resetPassword, isLoading: isResetting } =
    useResetCustomerPassword();

  const isLoading = loadingAll || loadingActive || loadingInactive;

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn ngưng hoạt động tài khoản này?")) {
      try {
        await deactivateCustomer(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("Bạn có chắc muốn khôi phục hoạt động tài khoản này?")) {
      try {
        await activateCustomer(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAdd = async (data) => {
    try {
      await addCustomer(data);
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetPassword = (customer) => {
    setSelectedCustomer(customer);
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordConfirm = async (passwordData) => {
    try {
      await resetPassword({
        id: selectedCustomer.id,
        data: passwordData,
      });
      toast.success("Đặt lại mật khẩu thành công!");
      setShowResetPasswordModal(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi đặt lại mật khẩu!"
      );
    }
  };

  const getCurrentCustomers = () => {
    switch (activeTab) {
      case "ACTIVE":
        return activeCustomers || [];
      case "INACTIVE":
        return inactiveCustomers || [];
      default:
        return allCustomers || [];
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
          <h1>Quản lý Khách hàng</h1>
          <p>Quản lý thông tin khách hàng của spa</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaUserPlus /> Thêm khách hàng
          </button>
        </div>
      </div>

      <CustomerTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          all: allCustomers?.length || 0,
          active: activeCustomers?.length || 0,
          inactive: inactiveCustomers?.length || 0,
        }}
      />

      <CustomerTable
        customers={getCurrentCustomers()}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onResetPassword={handleResetPassword} // Add this line
      />

      {showAddModal && (
        <CustomerAddModal
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAdd}
          isLoading={isAdding}
        />
      )}

      {showResetPasswordModal && selectedCustomer && (
        <ResetPasswordModal
          customer={selectedCustomer}
          onClose={() => {
            setShowResetPasswordModal(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleResetPasswordConfirm}
          isLoading={isResetting}
        />
      )}
    </div>
  );
};

export default Customers;
