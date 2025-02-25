import React from "react";
import AdminLayout from "../Layout/AdminLayout";
import styles from "./Products.module.scss";

const Products = () => {
  return (
    <AdminLayout>
      <div className={styles.products}>
        <h1>Quản lý sản phẩm</h1>
        {/* Nội dung quản lý sản phẩm */}
      </div>
    </AdminLayout>
  );
};

export default Products;
