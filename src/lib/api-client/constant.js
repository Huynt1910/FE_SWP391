export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const END_POINTS = {
  signIn: { path: "/authentication/log-in", method: "POST" },
  staffSignIn: { path: "/authentication/staff-login", method: "POST" },
  therapistSignIn: { path: "/authentication/therapist-login", method: "POST" },
  signUp: { path: "/users", method: "POST" },
  myInfo: { path: "/users/myInfo", method: "GET", secure: true },
  forgotpassword: {
    path: "/authentication/changeForgotPassword",
    method: "POST",
  },
  verifyEmail: {
    path: "/forgot-password/verifyEmail/:email",
    method: "POST",
    parameterized: true,
  },
  verifyOtp: {
    path: "/forgot-password/verifyOtp/:email/:otp",
    method: "POST",
    parameterized: true,
  },
  changeForgotPassword: {
    path: "/forgot-password/changeForgotPassword/:email",
    method: "POST",
    parameterized: true,
  },
  getSurveyQuestions: {
    path: "/survey/questions",
    method: "GET",
    secure: true,
  },
  updateInfo: {
    path: "/users/update",
    method: "PUT",
    secure: true,
  },
  changePassword: {
    path: "/users/change-password",
    method: "PUT",
    secure: true,
  },
  getActiveTherapists: { path: "/therapists/activeTherapists", method: "GET", secure: true },
  getTherapistsByService: { path: "/booking/therapists", method: "POST", secure: false },
  getAvailableSlots: { path: "/booking/slots", method: "POST", secure: false },
  createBooking: { path: "/booking/createBooking", method: "POST", secure: false },
  getTherapistSchedule: { path: "/schedule/therapist/month/:month/:year", method: "GET", parameterized: true, secure: false },
  getTherapistScheduleById: { path: "/schedule/therapist/getById/:id", method: "GET", parameterized: true, secure: false },
  getVouchers: { path: "/vouchers", method: "GET", secure: false },
  getAllTherapists: { path: "/therapists", method: "GET", secure: false },
  getAllServices: { path: "/services", method: "GET", secure: false },
  getServiceById: { path: "/services/:id", method: "GET", parameterized: true, secure: false },
  refreshToken: { path: "/authentication/refresh-token", method: "POST", secure: true },
  getCustomerPendingBookings: { 
    path: "/booking/customer/:userId/pending", 
    method: "GET", 
    parameterized: true, 
    secure: false
  },
  deleteBooking: {
    path: "/booking/delete/:bookingId",
    method: "DELETE",
    parameterized: true,
    secure: true
  },
  finishBooking: {
    path: "/booking/:bookingId/finish",
    method: "POST",
    parameterized: true,
    secure: true
  },
};

export const ACTIONS = {
  SIGN_IN: "signIn",
  STAFF_SIGN_IN: "staffSignIn",
  THERAPIST_SIGN_IN: "therapistSignIn",
  SIGN_UP: "signUp",
  MY_INFO: "myInfo",
  FORGOT_PASSWORD: "forgotpassword",
  VERIFY_EMAIL: "verifyEmail",
  VERIFY_OTP: "verifyOtp",
  CHANGE_FORGOT_PASSWORD: "changeForgotPassword",
  GET_SURVEY_QUESTIONS: "getSurveyQuestions",
  UPDATE_INFO: "updateInfo",
  CHANGE_PASSWORD: "changePassword",
  GET_ACTIVE_THERAPISTS: "getActiveTherapists",
  GET_THERAPISTS_BY_SERVICE: "getTherapistsByService",
  GET_AVAILABLE_SLOTS: "getAvailableSlots",
  CREATE_BOOKING: "createBooking",
  GET_THERAPIST_SCHEDULE: "getTherapistSchedule",
  GET_THERAPIST_SCHEDULE_BY_ID: "getTherapistScheduleById",
  GET_VOUCHERS: "getVouchers",
  GET_ALL_THERAPISTS: "getAllTherapists",
  GET_ALL_SERVICES: "getAllServices",
  GET_SERVICE_BY_ID: "getServiceById",
  REFRESH_TOKEN: "refreshToken",
  GET_CUSTOMER_PENDING_BOOKINGS: "getCustomerPendingBookings",
  DELETE_BOOKING: "deleteBooking",
  FINISH_BOOKING: "finishBooking",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";