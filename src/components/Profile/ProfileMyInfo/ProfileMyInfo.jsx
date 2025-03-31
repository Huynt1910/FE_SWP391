// components/ProfileMyInfo.jsx
import React, { useState, useEffect } from "react";
import { useMyInfo } from "@/auth/hook/useMyInfoHook";
import { useUpdateUser } from "@/auth/hook/useUpdateUserHook";
import { useChangePassword } from "@/auth/hook/useChangePasswordHook";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import UpdateInfoModal from "./Modal/UpdateInfoModal";
import ChangeEmailModal from "./Modal/ChangeEmailModal";
import ChangePhoneModal from "./Modal/ChangePhoneModal";
import ChangePasswordModal from "./Modal/ChangePasswordModal";
import { maskEmail, maskPhone } from "./Helper/Helper";

export const ProfileMyInfo = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    birthDate: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form data for modals
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [updateFormData, setUpdateFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    address: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Hooks for updating user info and fetching personal info
  const { mutate: updateUser } = useUpdateUser();
  const { data, isLoading, error } = useMyInfo();
  const { mutate: changePassword, isLoading: isPasswordLoading } =
    useChangePassword();

  useEffect(() => {
    if (data?.profile) {
      setFormData(data.profile);
    }
  }, [data]);

  useEffect(() => {
    if (isUpdateModalOpen) {
      setUpdateFormData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        address: formData.address,
      });
    }
  }, [isUpdateModalOpen, formData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Handle updating personal info
  const handleUpdateSubmit = () => {
    const payload = { ...updateFormData };

    updateUser(payload, {
      onSuccess: (updatedData) => {
        setFormData((prev) => ({ ...prev, ...updatedData }));
        setIsUpdateModalOpen(false);
        toast.success("Your information updated successfully!");
      },
      onError: (error) => {
        toast.error(`Cập nhật thất bại: ${error.message}`);
      },
    });
  };

  // Handle updating phone number
  const handlePhoneUpdate = () => {
    const payload = { phone: newPhone };

    updateUser(payload, {
      onSuccess: (updatedData) => {
        setFormData((prev) => ({ ...prev, phone: updatedData.phone }));
        setIsPhoneModalOpen(false);
        setNewPhone("");
        toast.success("Phone updated successfully!");
      },
      onError: (error) => {
        toast.error(`Cập nhật số điện thoại thất bại: ${error.message}`);
      },
    });
  };

  // Handle updating email
  const handleEmailUpdate = () => {
    const payload = { email: newEmail };

    updateUser(payload, {
      onSuccess: (updatedData) => {
        setFormData(updatedData);
        setIsEmailModalOpen(false);
        setNewEmail("");
        toast.success("Email updated successfully!");
      },
      onError: (error) => {
        toast.error("Email update failed: " + error.message);
      },
    });
  };

  // Handle changing password
  const handlePasswordChange = () => {
    changePassword(
      {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      },
      {
        onSuccess: () => {
          setIsPasswordModalOpen(false);
          setPasswordData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          toast.success("Password has been changed");
        },
        onError: (error) => {
          toast.error(`Change password failed: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="profile-my-info-container">
      <div className="profile-my-info-title-container">
        <div className="profile-my-info-title">My profile</div>
        <button
          onClick={() => setIsUpdateModalOpen(true)}
          className="profile-my-info-update-button"
        >
          Update Info
        </button>
      </div>

      <div className="profile-my-info-content">
        {/* Thông tin cá nhân */}
        <div className="profile-my-info-info-container">
          <div className="profile-my-info-personal-section">
            <div className="profile-my-info-info-title">Information</div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username || ""}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Full name</label>
              <input
                type="text"
                value={`${formData.firstName} ${formData.lastName}`}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Gender</label>
              <input
                type="text"
                value={formData.gender || ""}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Birth Date</label>
              <input
                type="text"
                value={formData.birthDate || ""}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
            <div className="profile-my-info-form-group">
              <label className="profile-my-info-label">Address</label>
              <input
                type="text"
                value={formData.address || ""}
                disabled
                className="profile-my-info-input profile-my-info-input-disabled"
              />
            </div>
          </div>
        </div>

        {/* Modal cập nhật thông tin */}
        {isUpdateModalOpen && (
          <UpdateInfoModal
            updateFormData={updateFormData}
            setUpdateFormData={setUpdateFormData}
            onSubmit={handleUpdateSubmit}
            onCancel={() => setIsUpdateModalOpen(false)}
          />
        )}

        {/* Phần bảo mật thông tin */}
        <div className="profile-my-info-security-section">
          <div className="profile-my-info-security-title">Security</div>
          <div className="profile-my-info-form-group">
            <label className="profile-my-info-label">Email</label>
            <div className="profile-my-info-input-group masked-field">
              <input
                type="text"
                name="email"
                value={editMode ? formData.email : maskEmail(formData.email)}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="profile-my-info-change-button"
              >
                Change
              </button>
            </div>
          </div>
          <div className="profile-my-info-form-group">
            <label className="profile-my-info-label">Phone</label>
            <div className="profile-my-info-input-group masked-field">
              <input
                type="text"
                name="phone"
                value={editMode ? formData.phone : maskPhone(formData.phone)}
                disabled={!editMode}
                onChange={handleInputChange}
                className={`profile-my-info-input ${
                  editMode ? "" : "profile-my-info-input-disabled"
                }`}
              />
              <button
                onClick={() => setIsPhoneModalOpen(true)}
                className="profile-my-info-change-button"
              >
                Change
              </button>
            </div>
          </div>
          <div className="profile-my-info-form-group">
            <h3 className="profile-my-info-label">Password</h3>
            <div className="profile-my-info-input-group">
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="profile-my-info-change-button"
              >
                Change
              </button>
            </div>
          </div>
          {isEmailModalOpen && (
            <ChangeEmailModal
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              onSubmit={handleEmailUpdate}
              onCancel={() => setIsEmailModalOpen(false)}
            />
          )}
          {isPhoneModalOpen && (
            <ChangePhoneModal
              newPhone={newPhone}
              setNewPhone={setNewPhone}
              onSubmit={handlePhoneUpdate}
              onCancel={() => {
                setIsPhoneModalOpen(false);
                setNewPhone("");
              }}
            />
          )}
          {isPasswordModalOpen && passwordData && (
            <ChangePasswordModal
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              onSubmit={handlePasswordChange}
              onCancel={() => {
                setIsPasswordModalOpen(false);
                setPasswordData({
                  oldPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
              }}
            />
          )}
        </div>

        {editMode && (
          <div className="profile-my-info-form-actions">
            <button
              onClick={() => {
                updateUser(
                  { ...formData },
                  {
                    onSuccess: (updatedData) => {
                      setFormData(updatedData);
                      setEditMode(false);
                      toast.success("Cập nhật thành công!");
                    },
                    onError: (error) =>
                      toast.error("Cập nhật thất bại! " + error.message),
                  }
                );
              }}
              className="profile-my-info-submit-button"
            >
              Submit
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="profile-my-info-cancel-button"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMyInfo;
