import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import styles from "./Settings.module.scss";

const Settings = () => {
  return (
    <AdminLayout>
      <div className={styles.settings}>
        <h1>Cài đặt</h1>
        {/* Nội dung cài đặt */}
      </div>
    </AdminLayout>
  );
};

export default Settings;
