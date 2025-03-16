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
  getAllTherapists: {
    path: "/therapists",
    method: "GET",
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
};
export const ACTIONS = {
  SYSTEM_LOGIN: "systemLogin",
  GET_SYSTEM_USER_INFO: "getSystemUserInfo",
  GET_ALL_USERS: "getAllUsers",
  GET_ALL_THERAPISTS: "getAllTherapists",
  GET_ALL_STAFFS: "getAllStaffs",
  GET_ALL_SERVICES: "getAllServices",
  CREATE_SERVICE: "createService",
};

export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  THERAPIST: "therapist",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";
