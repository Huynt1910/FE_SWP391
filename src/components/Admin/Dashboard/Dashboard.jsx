import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import styles from "./Dashboard.module.scss";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className={styles.dashboard}>
        <h1>Dashboard</h1>
        {/* Nội dung dashboard */}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
