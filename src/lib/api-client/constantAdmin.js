export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};
export const END_POINTS = {
  systemLogin: {
    path: "/authentication/system-login",
    method: "POST",
  },
  getSystemUserInfo: {
    path: "/users/system-info",
    method: "GET",
    secure: true,
  },
  getAllUsers: {
    path: "/users",
    method: "GET",
    secure: true,
  },
  getActiveUsers: {
    path: "/users/active",
    method: "GET",
    secure: true,
  },
  getInactiveUsers: {
    path: "/users/inactive",
    method: "GET",
    secure: true,
  },
  deactivateUser: {
    path: "/users",
    method: "PUT",
    secure: true,
  },
  activateUser: {
    path: "/users/active",
    method: "PUT",
    secure: true,
  },
  resetUserPassword: {
    path: "/users/reset-password",
    method: "PUT",
    secure: true,
  },
  getAllTherapists: {
    path: "/therapists",
    method: "GET",
    secure: true,
  },
  getActiveTherapists: {
    path: "/therapists/activeTherapists",
    method: "GET",
    secure: true,
  },
  getInactiveTherapists: {
    path: "/therapists/inactiveTherapists",
    method: "GET",
    secure: true,
  },
  deleteTherapist: {
    path: "/therapists/delete",
    method: "PUT",
    secure: true,
  },
  restoreTherapist: {
    path: "/therapists/restore",
    method: "PUT",
    secure: true,
  },
  getAllStaffs: {
    path: "/staffs",
    method: "GET",
    secure: true,
  },
  getAllServices: {
    path: "/services",
    method: "GET",
    secure: true,
  },
  createService: {
    path: "/services",
    method: "POST",
    secure: true,
  },
  createTherapist: {
    path: "/therapists",
    method: "POST",
    secure: true,
  },
  updateTherapist: {
    path: "/therapists/updateTherapist",
    method: "PUT",
    secure: true,
  },
  resetPassword: {
    path: "/therapists/reset-password",
    method: "PUT",
    secure: true,
  },
  getTherapistScheduleByDate: {
    path: "/schedule/therapist",
    method: "GET",
    secure: true,
  },
  createTherapistSchedule: {
    path: "/schedule/therapist",
    method: "POST",
    secure: true,
  },
  updateTherapistSchedule: {
    path: "/schedule/therapist/update",
    method: "PUT",
    secure: true,
  },
  deleteTherapistSchedule: {
    path: "/schedule/therapist",
    method: "DELETE",
    secure: true,
  },
  getTherapistScheduleByMonth: {
    path: "/schedule/therapist/month",
    method: "GET",
    secure: true,
  },
  getAllSlots: {
    path: "/slot/getAllSlot",
    method: "GET",
    secure: true,
  },
  therapistSchedule: {
    getByDate: {
      path: "/schedule/therapist",
      method: "GET",
      secure: true,
    },
    getById: {
      path: "/schedule/therapist/getById",
      method: "GET",
      secure: true,
    },
    getByMonth: {
      path: "/schedule/therapist/month",
      method: "GET",
      secure: true,
    },
    create: {
      path: "/schedule/therapist",
      method: "POST",
      secure: true,
    },
    update: {
      path: "/schedule/therapist/update",
      method: "PUT",
      secure: true,
    },
    delete: {
      path: "/schedule/therapist",
      method: "DELETE",
      secure: true,
    },
  },
  vouchers: {
    getAll: {
      path: "/vouchers",
      method: "GET",
      secure: true,
    },
    create: {
      path: "/vouchers",
      method: "POST",
      secure: true,
    },
  },
};
export const ACTIONS = {
  SYSTEM_LOGIN: "systemLogin",
  GET_SYSTEM_USER_INFO: "getSystemUserInfo",
  GET_ALL_USERS: "getAllUsers",
  GET_ACTIVE_USERS: "getActiveUsers",
  GET_INACTIVE_USERS: "getInactiveUsers",
  DEACTIVATE_USER: "deactivateUser",
  ACTIVATE_USER: "activateUser",
  RESET_USER_PASSWORD: "resetUserPassword",
  GET_ALL_THERAPISTS: "getAllTherapists",
  GET_ACTIVE_THERAPISTS: "getActiveTherapists",
  GET_INACTIVE_THERAPISTS: "getInactiveTherapists",
  DELETE_THERAPIST: "deleteTherapist",
  RESTORE_THERAPIST: "restoreTherapist",
  GET_ALL_STAFFS: "getAllStaffs",
  GET_ALL_SERVICES: "getAllServices",
  CREATE_SERVICE: "createService",
  CREATE_THERAPIST: "createTherapist",
  UPDATE_THERAPIST: "updateTherapist",
  RESET_PASSWORD: "resetPassword",
  GET_ALL_SLOTS: "getAllSlots",
  GET_ALL_VOUCHERS: "getAllVouchers",
  CREATE_VOUCHER: "createVoucher",
};

export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  THERAPIST: "therapist",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";
