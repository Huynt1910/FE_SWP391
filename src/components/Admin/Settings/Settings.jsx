import React, { useState } from "react";
import { FaSpinner, FaTicketAlt } from "react-icons/fa";
import { useVoucherActions } from "@/auth/hook/admin/useVoucherActions";
import { toast } from "react-toastify";
import VoucherTable from "./components/VoucherSection/components/VoucherTable";
import AddVoucherModal from "./components/VoucherSection/components/AddVoucherModal";
import EditVoucherModal from "./components/VoucherSection/components/EditVoucherModal";

const Settings = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [modalState, setModalState] = useState({
    edit: false,
    add: false,
  });

  const {
    vouchers,
    isLoading,
    createVoucher,
    updateVoucher,
    activateVoucher,
    deactivateVoucher,
  } = useVoucherActions();

  const openModal = (type, voucher = null) => {
    if (type === "edit" && !voucher) {
      console.error("Cannot open edit modal without a valid voucher");
      return;
    }
    setSelectedVoucher(voucher);
    setModalState((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setSelectedVoucher(null);
    setModalState((prev) => ({ ...prev, [type]: false }));
  };

  const handleToggleStatus = async (voucher) => {
    const isActive = voucher.isActive;
    const message = isActive
      ? "Bạn có chắc muốn ngưng hoạt động voucher này?"
      : "Bạn có chắc muốn kích hoạt voucher này?";

    if (window.confirm(message)) {
      try {
        await (isActive
          ? deactivateVoucher(voucher.voucherId)
          : activateVoucher(voucher.voucherId));
        toast.success(
          `${isActive ? "Ngưng hoạt động" : "Kích hoạt"} voucher thành công!`
        );
      } catch (error) {
        toast.error(
          `Lỗi ${isActive ? "ngưng hoạt động" : "kích hoạt"} voucher!`
        );
        console.error("Error toggling voucher status:", error);
      }
    }
  };

  const handleUpdateConfirm = async (data) => {
    try {
      console.log("Selected voucher before API call:", selectedVoucher);

      if (!selectedVoucher || !selectedVoucher.voucherId) {
        throw new Error("Voucher ID không tồn tại!");
      }

      const voucherId = selectedVoucher.voucherId;

      await updateVoucher({
        voucherId, // Đảm bảo truyền đúng voucherId
        data,
      });

      toast.success("Cập nhật voucher thành công!");
      closeModal("edit");
    } catch (error) {
      toast.error(error.message || "Lỗi cập nhật voucher!");
      console.error("Error updating voucher:", error);
    }
  };

  const handleAddConfirm = async (voucherData) => {
    try {
      await createVoucher(voucherData);
      toast.success("Thêm voucher thành công!");
      closeModal("add");
    } catch (error) {
      toast.error("Lỗi thêm voucher!");
      console.error("Error creating voucher:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  console.log("Selected voucher:", selectedVoucher);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div className="admin-page__header-title">
          <h1>Quản lý Voucher</h1>
          <p>Quản lý và cập nhật các mã giảm giá</p>
        </div>
        <div className="admin-page__header-actions">
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => openModal("add")}
          >
            <FaTicketAlt />
            Thêm Voucher
          </button>
        </div>
      </div>

      <VoucherTable
        vouchers={vouchers}
        onEdit={(voucher) => openModal("edit", voucher)}
        onToggleStatus={handleToggleStatus}
      />

      {modalState.add && (
        <AddVoucherModal
          onClose={() => closeModal("add")}
          onConfirm={handleAddConfirm}
        />
      )}

      {modalState.edit && selectedVoucher && (
        <EditVoucherModal
          voucher={selectedVoucher}
          onClose={() => closeModal("edit")}
          onConfirm={handleUpdateConfirm}
        />
      )}
    </div>
  );
};

export default Settings;
