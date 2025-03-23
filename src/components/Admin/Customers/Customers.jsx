import React from "react";
import { useCustomerActions } from "@/auth/hook/admin/useCustomerActions";
import CustomerTable from "./components/CustomerTable";
import { FaSpinner } from "react-icons/fa";

const Customers = () => {
  const { customers, isLoading, deactivateCustomer, activateCustomer } =
    useCustomerActions();

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
      </div>
      <CustomerTable
        customers={customers || []}
        onDeactivate={deactivateCustomer}
        onActivate={activateCustomer}
      />
    </div>
  );
};

export default Customers;
