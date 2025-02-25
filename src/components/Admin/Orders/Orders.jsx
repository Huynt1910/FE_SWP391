import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import styles from "./Orders.module.scss";

const Orders = () => {
  return (
    <AdminLayout>
      <div className={styles.orders}>
        <h1>Quản lý đơn hàng</h1>
        {/* Nội dung quản lý đơn hàng */}
      </div>
    </AdminLayout>
  );
};

export default Orders;
