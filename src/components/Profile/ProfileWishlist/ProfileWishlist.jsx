import React from "react";

const ProfileWishlist = () => {
  const products = [
    {
      id: 1,
      name: "Kem Che Khuyết Điểm Maybelline Mịn Lì 05 Ivory 6.8ml",
      brand: "MAYBELLINE",
      date: "23/02/2025",
      status: "Còn hàng",
      price: "135,000 đ",
      oldPrice: "170,000 đ",
      image: "https://via.placeholder.com/50", // Thay bằng ảnh thực tế
    },
    {
      id: 2,
      name: "Bút Cushion Che Khuyết Điểm Maybelline 120 Light 6ml",
      brand: "MAYBELLINE",
      date: "23/02/2025",
      status: "Còn hàng",
      price: "188,000 đ",
      oldPrice: "238,000 đ",
      image: "https://via.placeholder.com/50", // Thay bằng ảnh thực tế
    },
  ];

  return (
    <div className={styles["wishlist-container"]}>
      <h2 className={styles["wishlist-title"]}>Danh sách yêu thích</h2>
      <div className={styles["wishlist-table-container"]}>
        <table className={styles["wishlist-table"]}>
          <thead>
            <tr>
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
                <td className={styles["product-info"]}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={styles["product-image"]}
                  />
                  <div>
                    <span className={styles["product-brand"]}>
                      {product.brand}
                    </span>
                    <p className={styles["product-name"]}>{product.name}</p>
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

export default ProfileWishlist;
