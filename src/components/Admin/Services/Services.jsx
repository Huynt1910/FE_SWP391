import React, { useState } from "react";
import { FaSpinner, FaSpa } from "react-icons/fa";
import { useServiceActions } from "@/auth/hook/admin/useServiceActions";
import ServiceTable from "./components/ServiceTable";
import ServiceAddModal from "./components/ServiceAddModal";
import { toast } from "react-toastify";

const Services = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const {
    useGetAllServices,
    useCreateService,
    useUpdateService,
    useDeleteService,
  } = useServiceActions();

  const { data: services, isLoading } = useGetAllServices();
  const { mutate: createService, isLoading: isCreating } = useCreateService();
  const { mutate: updateService, isLoading: isUpdating } = useUpdateService();
  const { mutate: deleteService } = useDeleteService();

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      try {
        await deleteService(id);
      } catch (error) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý Dịch vụ</h1>
          <p>Quản lý và cập nhật các dịch vụ spa</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaSpa /> Thêm Dịch vụ
          </button>
        </div>
      </div>

      <ServiceTable
        services={services || []}
        onEdit={(service) => {
          setSelectedService(service);
          setShowAddModal(true);
        }}
        onDelete={handleDelete}
      />

      {showAddModal && (
        <ServiceAddModal
          service={selectedService}
          onClose={() => {
            setShowAddModal(false);
            setSelectedService(null);
          }}
          onConfirm={selectedService ? updateService : createService}
          isLoading={selectedService ? isUpdating : isCreating}
        />
      )}
    </div>
  );
};

export default Services;
