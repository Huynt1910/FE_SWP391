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
};
export const ACTIONS = {
  SYSTEM_LOGIN: "systemLogin",
  GET_SYSTEM_USER_INFO: "getSystemUserInfo",
};

export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  THERAPIST: "therapist",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";
