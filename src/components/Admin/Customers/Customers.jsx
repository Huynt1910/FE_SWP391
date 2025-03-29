import React, { useState } from "react";
import { useCustomerActions } from "@/auth/hook/admin/useCustomerActions";
import { FaSpinner, FaPlus } from "react-icons/fa";
import CustomerTable from "./Components/CustomerTable";
import AddCustomerModal from "./Components/AddCustomerModal";
import ResetPasswordModal from "./Components/ResetPasswordModal";
import { useCreateCustomer } from "@/auth/hook/admin/useCreateCustomer";

const Customers = () => {
  const {
    customers,
    isLoading,
    deactivateCustomer,
    activateCustomer,
    resetPassword,
  } = useCustomerActions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { mutate: createCustomer, isLoading: isCreating } = useCreateCustomer();

  const handleAddCustomer = (formData) => {
    createCustomer(formData, {
      onSuccess: () => {
        setIsAddModalOpen(false); // Đóng modal sau khi tạo thành công
      },
    });
  };

  const handleResetPassword = (customer) => {
    setSelectedCustomer(customer);
    setIsResetPasswordModalOpen(true);
  };

  const handleConfirmResetPassword = async (passwordData) => {
    try {
      // Gọi API đặt lại mật khẩu
      await resetPassword({
        userId: selectedCustomer.id,
        passwordData,
      });
      setIsResetPasswordModalOpen(false);
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
        <h1>Quản lý khách hàng</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <FaPlus /> Thêm khách hàng
        </button>
      </div>
      <CustomerTable
        customers={customers || []}
        onDeactivate={deactivateCustomer}
        onActivate={activateCustomer}
        onResetPassword={handleResetPassword} // Truyền hàm vào đây
      />
      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={handleAddCustomer}
          isLoading={isCreating}
        />
      )}
      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          customer={selectedCustomer}
          onClose={() => setIsResetPasswordModalOpen(false)}
          onConfirm={handleConfirmResetPassword}
          isLoading={false} // Thay bằng trạng thái loading thực tế nếu cần
        />
      )}
    </div>
  );
};

export default Customers;
