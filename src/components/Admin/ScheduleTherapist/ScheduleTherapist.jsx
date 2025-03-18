import React, { useState } from "react";
import { useScheduleActions } from "@/auth/hook/admin/useScheduleActions";

import { toast } from "react-toastify";
import ScheduleHeader from "./components/HeaderSchedule";
import ScheduleTable from "./components/ScheduleTable";
import AddScheduleModal from "./components/AddScheduleModal";
import EditScheduleModal from "./components/EditScheduleModal";

const ScheduleTherapist = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    useGetScheduleByDate,
    useCreateSchedule,
    useUpdateSchedule,
    useDeleteSchedule,
  } = useScheduleActions();

  const { data: schedules, isLoading } = useGetScheduleByDate(selectedDate);
  const { mutate: createSchedule, isLoading: isCreating } = useCreateSchedule();
  const { mutate: updateSchedule, isLoading: isUpdating } = useUpdateSchedule();
  const { mutate: deleteSchedule } = useDeleteSchedule();

  const handleAdd = (data) => {
    createSchedule(data, {
      onSuccess: () => {
        setShowAddModal(false);
      },
    });
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditModal(true);
  };

  const handleUpdate = (id, data) => {
    updateSchedule(
      { id, data },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setSelectedSchedule(null);
        },
      }
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa lịch làm việc này?")) {
      deleteSchedule(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      <ScheduleHeader
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onAddClick={() => setShowAddModal(true)}
      />

      <ScheduleTable
        schedules={schedules}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {showAddModal && (
        <AddScheduleModal
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAdd}
          isLoading={isCreating}
        />
      )}

      {showEditModal && (
        <EditScheduleModal
          schedule={selectedSchedule}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSchedule(null);
          }}
          onConfirm={handleUpdate}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
};

export default ScheduleTherapist;
