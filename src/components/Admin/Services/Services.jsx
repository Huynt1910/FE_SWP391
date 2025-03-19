import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useServiceActions } from "@/auth/hook/admin/useServiceActionsHook";
import ServiceTable from "./components/ServiceTable";
import ServiceAddModal from "./components/ServiceAddModal";
import ServiceEditModal from "./components/ServiceEditModal";

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Get all hooks from useServiceActions
  const {
    useGetAllServices,
    createService,
    updateService,
    useDeactivateService,
    useActivateService,
  } = useServiceActions();

  // Use the hooks
  const { data: services, isLoading } = useGetAllServices();
  const { mutate: deactivateService } = useDeactivateService();
  const { mutate: activateService } = useActivateService();

  // Handle create service
  const handleAdd = async (formData) => {
    try {
      await createService.mutateAsync(formData);
      setShowAddModal(false);
    } catch (error) {
      console.error("Add service failed:", error);
    }
  };

  // Handle update service
  const handleEdit = (service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleUpdate = async (serviceId, formData) => {
    try {
      await updateService.mutateAsync({ id: serviceId, data: formData });
      setShowEditModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Update service failed:", error);
    }
  };

  // Handle toggle service status
  const handleToggleStatus = async (service) => {
    try {
      if (service.isActive) {
        await deactivateService(service.serviceId);
      } else {
        await activateService(service.serviceId);
      }
    } catch (error) {
      console.error("Toggle status failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1>Quản lý Dịch vụ</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          Thêm Dịch vụ
        </button>
      </div>

      <ServiceTable
        services={services}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      {showAddModal && (
        <ServiceAddModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
          isLoading={createService.isLoading}
        />
      )}

      {showEditModal && selectedService && (
        <ServiceEditModal
          service={selectedService}
          onClose={() => {
            setShowEditModal(false);
            setSelectedService(null);
          }}
          onConfirm={handleUpdate}
          isLoading={updateService.isLoading}
        />
      )}
    </div>
  );
};

export default Services;
