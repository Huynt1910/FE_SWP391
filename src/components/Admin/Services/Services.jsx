import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash,
  FaCircle,
  FaSort,
  FaLock,
  FaUnlock,
} from "react-icons/fa";

function Services() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // 'add', 'edit', 'view'
  const [selectedService, setSelectedService] = useState(null);
  const [categories, setCategories] = useState([]);

  // Form state for adding/editing services
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    active: true, // Thay đổi từ status sang active
    image: "",
    benefits: [],
    requiredEquipment: [],
    recommendedFor: [],
  });

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, selectedCategory, priceRange, services, sortConfig]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Simulated API call - replace with actual API
      setTimeout(() => {
        const mockServices = [
          {
            id: 1,
            name: "Facial Deep Cleansing",
            description:
              "Comprehensive facial treatment for deep cleansing and rejuvenation",
            price: 850000,
            duration: 60, // minutes
            category: "facial",
            active: true,
            image: "https://example.com/images/facial-cleansing.jpg",
            benefits: [
              "Deep pore cleansing",
              "Removes blackheads",
              "Hydrates skin",
            ],
            requiredEquipment: [
              "Facial steamer",
              "Extraction tools",
              "Facial masks",
            ],
            recommendedFor: [
              "Oily skin",
              "Acne-prone skin",
              "Monthly maintenance",
            ],
          },
          {
            id: 2,
            name: "Anti-Aging Treatment",
            description:
              "Premium treatment targeting signs of aging with advanced ingredients",
            price: 1200000,
            duration: 90, // minutes
            category: "facial",
            active: true,
            image: "https://example.com/images/anti-aging.jpg",
            benefits: [
              "Reduces fine lines",
              "Improves skin elasticity",
              "Brightens complexion",
            ],
            requiredEquipment: [
              "LED therapy device",
              "Microcurrent machine",
              "Premium serums",
            ],
            recommendedFor: [
              "Mature skin",
              "Prevention care",
              "Special occasions",
            ],
          },
          {
            id: 3,
            name: "Acne Treatment",
            description: "Specialized treatment for acne and problematic skin",
            price: 750000,
            duration: 60, // minutes
            category: "medical",
            active: true,
            image: "https://example.com/images/acne-treatment.jpg",
            benefits: [
              "Reduces inflammation",
              "Fights bacteria",
              "Prevents breakouts",
            ],
            requiredEquipment: [
              "High frequency device",
              "Blue light therapy",
              "Medical-grade products",
            ],
            recommendedFor: ["Active acne", "Teenage skin", "Hormonal acne"],
          },
          {
            id: 4,
            name: "Body Scrub & Massage",
            description: "Full body exfoliation followed by relaxing massage",
            price: 950000,
            duration: 120, // minutes
            category: "body",
            active: true,
            image: "https://example.com/images/body-scrub.jpg",
            benefits: [
              "Exfoliates dead skin",
              "Improves circulation",
              "Deep relaxation",
            ],
            requiredEquipment: [
              "Massage table",
              "Body scrub products",
              "Essential oils",
            ],
            recommendedFor: [
              "Dry skin",
              "Stress relief",
              "Before special events",
            ],
          },
          {
            id: 5,
            name: "Skin Consultation",
            description:
              "Professional skin analysis and personalized skincare plan",
            price: 400000,
            duration: 45, // minutes
            category: "consultation",
            active: true,
            image: "https://example.com/images/skin-consultation.jpg",
            benefits: [
              "Professional analysis",
              "Personalized advice",
              "Treatment planning",
            ],
            requiredEquipment: [
              "Skin analyzer",
              "Consultation forms",
              "Product samples",
            ],
            recommendedFor: [
              "New clients",
              "Changing skincare routine",
              "Skin concerns",
            ],
          },
        ];
        setServices(mockServices);
        setFilteredServices(mockServices);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    // Simulated API call - replace with actual API
    setTimeout(() => {
      const mockCategories = [
        { id: 1, name: "facial", label: "Facial Treatments" },
        { id: 2, name: "body", label: "Body Treatments" },
        { id: 3, name: "medical", label: "Medical Treatments" },
        { id: 4, name: "consultation", label: "Consultations" },
        { id: 5, name: "package", label: "Treatment Packages" },
      ];
      setCategories(mockCategories);
    }, 300);
  };

  const filterServices = () => {
    let result = [...services];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (service) => service.category === selectedCategory
      );
    }

    // Apply price range filter
    if (priceRange.min !== "") {
      result = result.filter(
        (service) => service.price >= parseInt(priceRange.min)
      );
    }
    if (priceRange.max !== "") {
      result = result.filter(
        (service) => service.price <= parseInt(priceRange.max)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredServices(result);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "ascending" ? <FaSortUp /> : <FaSortDown />;
  };

  // Pagination
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Modal handlers
  const handleOpenModal = (mode, service = null) => {
    setModalMode(mode);
    setSelectedService(service);
    if (service && (mode === "edit" || mode === "view")) {
      setFormData({
        name: service.name,
        price: service.price,
        duration: service.duration,
        description: service.description,
        active: service.active,
      });
    } else {
      setFormData({
        name: "",
        price: "",
        duration: "",
        description: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMode("");
    setSelectedService(null);
    setFormData({
      name: "",
      price: "",
      duration: "",
      description: "",
      active: true,
    });
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle array fields (benefits, requiredEquipment, recommendedFor)
  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field, index) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const processedFormData = {
      ...formData,
      price: parseInt(formData.price),
      duration: parseInt(formData.duration),
    };

    if (modalMode === "add") {
      // Add new service
      const newService = {
        id: services.length + 1,
        ...processedFormData,
      };
      setServices([...services, newService]);
    } else if (modalMode === "edit") {
      // Update existing service
      const updatedServices = services.map((service) =>
        service.id === selectedService.id
          ? { ...service, ...processedFormData }
          : service
      );
      setServices(updatedServices);
    } else if (modalMode === "delete") {
      // Delete service
      const updatedServices = services.filter(
        (service) => service.id !== selectedService.id
      );
      setServices(updatedServices);
    }

    handleCloseModal();
  };

  // Toggle service active status
  const toggleServiceActive = (serviceId) => {
    setServices((prevServices) =>
      prevServices.map((service) => {
        if (service.id === serviceId) {
          return { ...service, active: !service.active };
        }
        return service;
      })
    );
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Export services data
  const exportServicesData = () => {
    // In a real application, this would generate a CSV or Excel file
    console.log("Exporting services data:", filteredServices);
    alert("Exporting services data...");
  };

  return (
    <div className="admin-page">
      {/* Header Section */}
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý dịch vụ</h1>
          <p>Quản lý thông tin các dịch vụ của spa</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal("add")}
          >
            <FaPlus /> Thêm dịch vụ
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="admin-page__filters">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <div className="filter">
            <label>Danh mục</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="facial">Chăm sóc da mặt</option>
              <option value="body">Chăm sóc cơ thể</option>
              <option value="massage">Massage</option>
            </select>
          </div>
          <div className="filter">
            <label>Trạng thái</label>
            <select>
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm ngưng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="admin-page__table">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Tên dịch vụ {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("price")}>
                Giá {getSortIcon("price")}
              </th>
              <th onClick={() => handleSort("duration")}>
                Thời gian {getSortIcon("duration")}
              </th>
              <th onClick={() => handleSort("active")}>
                Trạng thái {getSortIcon("active")}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentServices.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{formatPrice(service.price)}</td>
                <td>{service.duration} phút</td>
                <td>
                  <span
                    className={`status-badge status-badge--${
                      service.active ? "active" : "inactive"
                    }`}
                  >
                    <FaCircle />
                    {service.active ? "Đang hoạt động" : "Tạm ngưng"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => handleOpenModal("view", service)}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenModal("edit", service)}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="status-btn"
                      onClick={() => toggleServiceActive(service.id)}
                      title={service.active ? "Tạm ngưng" : "Kích hoạt"}
                    >
                      {service.active ? <FaLock /> : <FaUnlock />}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(service.id)}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="admin-page__pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Trước
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            className={`pagination-btn ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="pagination-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Sau &raquo;
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-page__modal">
          <div className="admin-page__modal-content">
            <div className="admin-page__modal-content-header">
              <h2>
                {modalMode === "view"
                  ? "Chi tiết dịch vụ"
                  : modalMode === "edit"
                  ? "Chỉnh sửa dịch vụ"
                  : "Thêm dịch vụ mới"}
              </h2>
              <button className="close-btn" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div className="admin-page__modal-content-body">
              {modalMode === "view" ? (
                <div className="service-details">
                  <p>
                    <strong>Tên dịch vụ:</strong> {selectedService.name}
                  </p>
                  <p>
                    <strong>Giá:</strong> {formatPrice(selectedService.price)}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {selectedService.duration} phút
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {selectedService.active ? "Đang hoạt động" : "Tạm ngưng"}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {selectedService.description}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Tên dịch vụ</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Giá dịch vụ</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Thời gian thực hiện (phút)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      name="active"
                      value={formData.active}
                      onChange={handleInputChange}
                    >
                      <option value={true}>Đang hoạt động</option>
                      <option value={false}>Tạm ngưng</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                    ></textarea>
                  </div>
                </form>
              )}
            </div>

            <div className="admin-page__modal-content-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Đóng
              </button>
              {modalMode !== "view" && (
                <button className="btn-primary" onClick={handleSubmit}>
                  {modalMode === "add" ? "Thêm dịch vụ" : "Lưu thay đổi"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;
