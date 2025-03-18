import React, { useState } from "react";
import { FaSpinner, FaTicketAlt } from "react-icons/fa";
import { useVoucherActions } from "@/auth/hook/admin/useVoucherActions";

import { toast } from "react-toastify";
import VoucherTable from "./components/VoucherSection/components/VoucherTable";
import { Add } from "@mui/icons-material";
import AddVoucherModal from "./components/VoucherSection/components/AddVoucherModal";

const Settings = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const {
    useGetAllVouchers,
    useCreateVoucher,
    useUpdateVoucher,
    useActivateVoucher,
    useDeactivateVoucher,
  } = useVoucherActions();

  const { data: vouchers, isLoading } = useGetAllVouchers();
  const { mutate: createVoucher, isLoading: isCreating } = useCreateVoucher();
  const { mutate: updateVoucher, isLoading: isUpdating } = useUpdateVoucher();
  const { mutate: activateVoucher } = useActivateVoucher();
  const { mutate: deactivateVoucher } = useDeactivateVoucher();

  const handleDeactivate = async (id) => {
    if (window.confirm("Bạn có chắc muốn ngưng kích hoạt voucher này?")) {
      try {
        await deactivateVoucher(id);
      } catch (error) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
      }
    }
  };

  const handleActivate = async (id) => {
    if (window.confirm("Bạn có chắc muốn kích hoạt lại voucher này?")) {
      try {
        await activateVoucher(id);
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
          <h1>Quản lý Voucher</h1>
          <p>Quản lý và cập nhật các mã giảm giá</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <FaTicketAlt /> Thêm Voucher
          </button>
        </div>
      </div>

      <VoucherTable
        vouchers={vouchers || []}
        onEdit={(voucher) => {
          setSelectedVoucher(voucher);
          setShowAddModal(true);
        }}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />

      {showAddModal && (
        <AddVoucherModal
          voucher={selectedVoucher}
          onClose={() => {
            setShowAddModal(false);
            setSelectedVoucher(null);
          }}
          onConfirm={selectedVoucher ? updateVoucher : createVoucher}
          isLoading={selectedVoucher ? isUpdating : isCreating}
        />
      )}
    </div>
  );
};

export default Settings;
