import React, { useState } from "react";
import { useCustomerActions } from "@/auth/hook/admin/useCustomerActions";
import { FaSpinner, FaPlus } from "react-icons/fa";
import CustomerTable from "./Components/CustomerTable";
import AddCustomerModal from "./Components/AddCustomerModal";
import { useCreateCustomer } from "@/auth/hook/admin/useCreateCustomer";

const Customers = () => {
  const { customers, isLoading, deactivateCustomer, activateCustomer } =
    useCustomerActions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { mutate: createCustomer, isLoading: isCreating } = useCreateCustomer();

  const handleAddCustomer = (formData) => {
    createCustomer(formData, {
      onSuccess: () => {
        setIsAddModalOpen(false); // Đóng modal sau khi tạo thành công
      },
    });
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
      />
      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={handleAddCustomer}
          isLoading={isCreating}
        />
      )}
    </div>
  );
};

export default Customers;
