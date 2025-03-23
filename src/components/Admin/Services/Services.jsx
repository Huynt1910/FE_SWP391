import React, { useState } from "react";
import { FaSpinner, FaCog } from "react-icons/fa";
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

  const {
    services,
    isLoading,
    createService,
    // updateService,
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
        toast.success(
          `${isActive ? "Ngưng hoạt động" : "Kích hoạt"} dịch vụ thành công!`
        );
      } catch (error) {
        toast.error(
          `Lỗi ${isActive ? "ngưng hoạt động" : "kích hoạt"} dịch vụ!`
        );
        console.error("Error toggling service status:", error);
      }
    }
  };

  const handleUpdateConfirm = async (data) => {
    try {
      await updateService({
        id: selectedService.id,
        data,
      });
      toast.success("Cập nhật dịch vụ thành công!");
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý Dịch vụ</h1>
          <p>Quản lý và cập nhật các dịch vụ</p>
        </div>
        <div className="admin-page__header-actions">
          <button className="btn-primary" onClick={() => openModal("add")}>
            <FaCog className="btn-icon" />
            <span>Thêm Dịch vụ</span>
          </button>
        </div>
      </div>

      <ServiceTable
        services={services}
        onEdit={(service) => openModal("edit", service)}
        onToggleStatus={handleToggleStatus}
      />

      {modalState.add && (
        <ServiceAddModal
          onClose={() => closeModal("add")}
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
