import React, { useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { useGetAllServices } from "@/auth/hook/admin/useGetAllServicesHook";
import { useCreateServices } from "@/auth/hook/admin/useCreateServicesHook";
import ServiceHeader from "./components/ServiceHeader";
import ServiceSearch from "./components/ServiceSearch";
import ServiceTable from "./components/ServiceTable";
import ServiceModal from "./components/ServiceModal";

function Services() {
  const { data: services, isLoading } = useGetAllServices();
  const { createService, isLoading: isCreating } = useCreateServices();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    active: "true",
    image: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "duration") {
      // Format as XX:XX
      const numbers = value.replace(/\D/g, "");
      let formattedValue = numbers;
      if (numbers.length >= 2) {
        formattedValue = `${numbers.slice(0, 2)}:${numbers.slice(2, 4)}`;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cập nhật formData với file
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Tạo preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const serviceData = {
        serviceName: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        isActive: formData.active === "true",
        duration: formData.duration,
        imgUrl: formData.image || "",
      };

      await createService(serviceData);
      toast.success("Thêm dịch vụ thành công!");
      setShowModal(false);
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        active: "true",
        image: "",
      });
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error("Error creating service:", error);
      toast.error("Có lỗi xảy ra khi thêm dịch vụ!");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedServices = React.useMemo(() => {
    let filteredServices =
      services?.filter(
        (service) =>
          service.serviceName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase())
      ) || [];

    if (sortConfig.key) {
      filteredServices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredServices;
  }, [services, searchTerm, sortConfig]);

  if (isLoading) {
    return (
      <div className="admin-page__loading">
        <FaSpinner className="spinner" /> Loading...
      </div>
    );
  }

  return (
    <div className="admin-page">
      <ServiceHeader onAddClick={() => setShowModal(true)} />
      <ServiceSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <ServiceTable
        services={filteredAndSortedServices}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={(service) => {
          /* handle edit */
        }}
        onDelete={(service) => {
          /* handle delete */
        }}
      />
      <ServiceModal
        show={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        imagePreview={imagePreview}
        onImageClick={handleImageClick}
        fileInputRef={fileInputRef}
        onImageChange={handleImageChange}
        isCreating={isCreating}
      />
    </div>
  );
}

export default Services;
