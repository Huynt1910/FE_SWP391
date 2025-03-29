import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useScheduleActions } from "@/auth/hook/admin/useScheduleActions";
import { useTherapistActions } from "@/auth/hook/admin/useTherapistActions"; // Import hook
import { toast } from "react-toastify";
import ScheduleHeader from "./components/HeaderSchedule";
import ScheduleTable from "./components/ScheduleTable";
import AddScheduleModal from "./components/AddScheduleModal";
import EditScheduleModal from "./components/EditScheduleModal";

const ScheduleManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
  });

  const {
    useGetScheduleByDate,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
  } = useScheduleActions();

  const { therapists, isLoading: isTherapistsLoading } = useTherapistActions(); // Lấy danh sách therapists

  // Get schedules for selected date
  const { data: schedules, isLoading } = useGetScheduleByDate(selectedDate);
  const { mutateAsync: createSchedule, isLoading: isCreating } =
    useCreateSchedule();
  const { mutateAsync: updateSchedule, isLoading: isUpdating } =
    useUpdateSchedule();
  const { mutateAsync: deleteSchedule, isLoading: isDeleting } =
    useDeleteSchedule();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddClick = () => {
    setModalState({ ...modalState, add: true });
  };

  const handleEditClick = (schedule) => {
    setSelectedSchedule(schedule);
    setModalState({ ...modalState, edit: true });
  };

  const handleCloseModal = (type) => {
    setModalState({ ...modalState, [type]: false });
    setSelectedSchedule(null);
  };

  const handleCreateSchedule = async (data) => {
    try {
      await createSchedule(data);
      handleCloseModal("add");
      toast.success("Tạo lịch làm việc thành công!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdateSchedule = async (id, data) => {
    try {
      // Pass the id and data separately to match the API structure
      await updateSchedule({ id, data });
      handleCloseModal("edit");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch làm việc này?")) {
      try {
        await deleteSchedule(id);
      } catch (error) {
        toast.error("Lỗi khi xóa lịch làm việc");
      }
    }
  };

  if (isLoading || isTherapistsLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <ScheduleHeader
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onAddClick={handleAddClick}
      />

      <ScheduleTable
        schedules={schedules}
        onEdit={handleEditClick}
        onDelete={handleDeleteSchedule}
      />

      {modalState.add && (
        <AddScheduleModal
          onClose={() => handleCloseModal("add")}
          onConfirm={handleCreateSchedule}
          isLoading={isCreating}
        />
      )}

      {modalState.edit && selectedSchedule && (
        <EditScheduleModal
          schedule={selectedSchedule}
          therapists={therapists} // Truyền danh sách therapist vào modal
          onClose={() => handleCloseModal("edit")}
          onConfirm={handleUpdateSchedule}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
