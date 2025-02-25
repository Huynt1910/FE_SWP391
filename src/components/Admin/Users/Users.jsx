import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import styles from "./Users.module.scss";

const Users = () => {
  return (
    <AdminLayout>
      <div className={styles.users}>
        <h1>Quản lý người dùng</h1>
        {/* Nội dung quản lý người dùng */}
      </div>
    </AdminLayout>
  );
};

export default Users;
