import React, { useState } from "react";
import { FaSpinner, FaPlus } from "react-icons/fa";
import { useServiceActions } from "@/auth/hook/admin/useServiceActionsHook";
import { toast } from "react-toastify";
import ServiceTable from "./Components/ServiceTable";
import ServiceAddModal from "./Components/ServiceAddModal";
import ServiceEditModal from "./Components/ServiceEditModal";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [modalState, setModalState] = useState({
    edit: false,
    add: false,
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // Lưu category được chọn

  const {
    services,
    isLoading,
    createService,
    updateService,
    activateService,
    deactivateService,
  } = useServiceActions();

  const openModal = (type, service = null) => {
    setSelectedService(service);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setSelectedService(null);
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleUpdateConfirm = async (formData) => {
    try {
      await updateService({
        id: selectedService.serviceId,
        formData,
      });
      closeModal("edit");
    } catch (error) {
      toast.error("Lỗi cập nhật dịch vụ!");
      console.error("Error updating service:", error);
    }
  };

  const handleAddConfirm = async (serviceData) => {
    try {
      await createService(serviceData);
      toast.success("Thêm dịch vụ thành công!");
      closeModal("add");
    } catch (error) {
      toast.error("Lỗi thêm dịch vụ!");
      console.error("Error creating service:", error);
    }
  };

  const handleToggleStatus = async (service) => {
    const isActive = service.isActive;
    const message = isActive
      ? "Bạn có chắc muốn ngưng hoạt động dịch vụ này?"
      : "Bạn có chắc muốn kích hoạt dịch vụ này?";

    if (window.confirm(message)) {
      try {
        await (isActive
          ? deactivateService(service.serviceId)
          : activateService(service.serviceId));
      } catch (error) {
        toast.error(
          `Lỗi ${isActive ? "ngưng hoạt động" : "kích hoạt"} dịch vụ!`
        );
        console.error("Error toggling service status:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
      </div>
    );
  }

  // Lọc danh sách dịch vụ theo category
  const filteredServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý Dịch vụ</h1>
          <p>Quản lý và cập nhật các dịch vụ</p>
        </div>
        <div className="admin-page__header-actions">
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {Array.from(
              new Set(services.map((service) => service.category))
            ).map((category, index) => (
              <option key={index} value={category}>
                {category || "Không có danh mục"}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus className="btn-icon" />
            Thêm Dịch vụ
          </button>
        </div>
      </div>

      <ServiceTable
        services={filteredServices} // Truyền danh sách dịch vụ đã lọc
        onEdit={(service) => openModal("edit", service)}
        onToggleStatus={handleToggleStatus}
      />

      {isAddModalOpen && (
        <ServiceAddModal
          onClose={() => setIsAddModalOpen(false)}
          onConfirm={handleAddConfirm}
        />
      )}

      {modalState.edit && selectedService && (
        <ServiceEditModal
          service={selectedService}
          onClose={() => closeModal("edit")}
          onConfirm={handleUpdateConfirm}
        />
      )}
    </div>
  );
};

export default Services;
