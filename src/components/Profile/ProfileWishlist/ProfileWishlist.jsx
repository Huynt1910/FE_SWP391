import React, { useState } from "react";
import styles from "./ProfileWishlist.module.scss";
const ProfileWishlist = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const products = [
    {
      id: 1,
      name: "Kem Che Khuyết Điểm Maybelline Mịn Lì 05 Ivory 6.8ml",
      description: "Kem che khuyết điểm với độ che phủ cao, kết cấu mịn nhẹ",
      brand: "MAYBELLINE",
      date: "23/02/2025",
      status: "Còn hàng",
      price: "135,000 đ",
      oldPrice: "170,000 đ",
    },
    {
      id: 2,
      name: "Bút Cushion Che Khuyết Điểm Maybelline 120 Light 6ml",
      description: "Bút cushion với đầu applicator mềm mại, dễ tán đều",
      brand: "MAYBELLINE",
      date: "23/02/2025",
      status: "Còn hàng",
      price: "188,000 đ",
      oldPrice: "238,000 đ",
    },
  ];

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div className={styles["wishlist-container"]}>
      <h2 className={styles["wishlist-title"]}>Danh sách yêu thích</h2>
      <div className={styles["wishlist-table-container"]}>
        <table className={styles["wishlist-table"]}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={handleSelectAll}
                  className={styles["checkbox-input"]}
                />
              </th>
              <th>Dịch vụ</th>
              <th>Ngày</th>
              <th>Còn lại</th>
              <th>Đơn giá</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className={styles["checkbox-cell"]}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className={styles["checkbox-input"]}
                  />
                </td>
                <td className={styles["product-info"]}>
                  <div>
                    <span className={styles["product-brand"]}>
                      {product.brand}
                    </span>
                    <p className={styles["product-name"]}>{product.name}</p>
                    <p className={styles["product-description"]}>
                      {product.description}
                    </p>
                  </div>
                </td>
                <td className={styles["text-center"]}>{product.date}</td>
                <td
                  className={`${styles["text-center"]} ${styles["product-status"]}`}
                >
                  ✔ {product.status}
                </td>
                <td className={styles["text-center"]}>
                  <span className={styles["product-price"]}>
                    {product.price}
                  </span>
                  <br />
                  <span className={styles["product-old-price"]}>
                    {product.oldPrice}
                  </span>
                </td>
                <td className={styles["text-center"]}>
                  <button className={styles["detail-button"]}>
                    Xem chi tiết
                  </button>
                  <br />
                  <button className={styles["cart-button"]}>
                    Thêm vào giỏ hàng
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { ProfileWishlist };
