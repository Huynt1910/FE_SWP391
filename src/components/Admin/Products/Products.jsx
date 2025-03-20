import React, { useState } from "react";

function Products() {
  // Dữ liệu sản phẩm ban đầu có thêm trường active
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 100, active: true },
    { id: 2, name: "Product 2", price: 150, active: true },
    { id: 3, name: "Product 3", price: 200, active: false },
  ]);

  // State cho form thêm mới sản phẩm (dùng modal)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    active: true,
  });
  // State cho form sửa sản phẩm (hiển thị trực tiếp)
  const [editingProduct, setEditingProduct] = useState(null);
  // State điều khiển hiển thị modal add
  const [showAddModal, setShowAddModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (newProduct.name && newProduct.price) {
      const newId =
        products.length > 0 ? products[products.length - 1].id + 1 : 1;
      const productToAdd = {
        id: newId,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        active: newProduct.active,
      };
      setProducts([...products, productToAdd]);
      setNewProduct({ name: "", price: "", active: true });
      setShowAddModal(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(
      products.map((product) =>
        product.id === editingProduct.id ? editingProduct : product
      )
    );
    setEditingProduct(null);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Thay vì nút Delete, thêm nút toggle bật/tắt trạng thái active
  const handleToggleActive = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product
      )
    );
  };

  return (
    <div className="products">
      <h1>Products CRUD</h1>
      <button className="add-product-btn" onClick={() => setShowAddModal(true)}>
        Add New Product
      </button>

      {/* Form sửa sản phẩm hiển thị trực tiếp */}
      {editingProduct && (
        <form className="edit-form" onSubmit={handleUpdateProduct}>
          <h2>Edit Product</h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={editingProduct.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={editingProduct.price}
            onChange={handleInputChange}
          />
          <label>
            Active:
            <input
              type="checkbox"
              name="active"
              checked={editingProduct.active}
              onChange={handleInputChange}
            />
          </label>
          <div className="form-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Bảng sản phẩm */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>$ {product.price}</td>
              <td>
                <button onClick={() => handleToggleActive(product.id)}>
                  {product.active ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="actions">
                <button
                  className="edit"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm mới sản phẩm */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct}>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleInputChange}
              />
              <label>
                Active:
                <input
                  type="checkbox"
                  name="active"
                  checked={newProduct.active}
                  onChange={handleInputChange}
                />
              </label>
              <div className="form-buttons">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
