import { path } from "d3-path";

export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const END_POINTS = {
  // Authentication
  signIn: {
    path: "/authentication/log-in",
    method: "POST",
    secure: false,
    publicAccess: true,
  },
  signInGoogle: {
    path: "/authentication/login-gg",
    method: "POST",
    secure: false,
    publicAccess: true,
  },
  signUp: { path: "/users", method: "POST", secure: false, publicAccess: true },
  refreshToken: {
    path: "/authentication/refresh-token",
    method: "POST",
    secure: true,
  },
  myInfo: { path: "/users/myInfo", method: "GET", secure: true },
  forgotpassword: {
    path: "/authentication/changeForgotPassword",
    method: "POST",
  },
  verifyEmail: {
    path: "/forgot-password/verifyEmail/:email",
    method: "POST",
    parameterized: true,
    secure: false,
    publicAccess: true,
  },
  verifyOtp: {
    path: "/forgot-password/verifyOtp/:email/:otp",
    method: "POST",
    parameterized: true,
    secure: false,
    publicAccess: true,
  },
  changeForgotPassword: {
    path: "/forgot-password/changeForgotPassword/:email",
    method: "POST",
    parameterized: true,
    secure: false,
    publicAccess: true,
  },
  changePassword: {
    path: "/users/change-password",
    method: "PUT",
    secure: true,
  },

  // User
  getAllUsers: { path: "/users", method: "GET", secure: true },
  getUserById: {
    path: "/users/:id",
    method: "GET",
    parameterized: true,
    secure: true,
  },
  createUser: { path: "/users", method: "POST", secure: true },
  deactivateUser: {
    path: "/users/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  activateUser: {
    path: "/users/active/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  resetUserPassword: {
    path: "/users/reset-password/:id",
    method: "PUT",
    secure: true,
  },

  // Therapist
  getAllTherapists: { path: "/therapists", method: "GET", secure: true },
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

  createTherapist: { path: "/therapists", method: "POST", secure: true },
  updateTherapist: {
    path: "/therapists/updateTherapist/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  deleteTherapist: {
    path: "/therapists/delete/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  restoreTherapist: {
    path: "/therapists/restore/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  resetPassword: {
    path: "/therapists/reset-password/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  therapistProfile: {
    path: "/therapists/therapistProfile",
    method: "GET",
    secure: true,
  },
  changePasswordTherapist: {
    path: "/therapists/change-password",
    method: "PUT",
    secure: true,
  },
  getTherapistFeedback: {
    path: "/feedback/therapist/:id",
    method: "GET",
    secure: true,
  },
  // Staff
  getAllStaffs: { path: "/staffs", method: "GET", secure: true },
  createStaff: { path: "/staffs", method: "POST", secure: true },
  updateStaff: {
    path: "/staffs/update/:id",
    method: "PUT",
    secure: true,
  },
  deactivateStaff: {
    path: "/staffs/delete/:id",
    method: "PUT",
    parameterized: true,
    acceptText: true,
    secure: true,
  },
  activateStaff: {
    path: "/staffs/restore/:id",
    method: "PUT",
    parameterized: true,
    acceptText: true,
    secure: true,
  },
  resetStaffPassword: {
    path: "/staffs/reset-password/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  getStaffInfo: {
    path: "/staffs/staffInfo",
    method: "GET",
    secure: true,
  },
  changePasswordStaff: {
    path: "/staffs/change-password",
    method: "PUT",
    secure: true,
  },

  // Service
  getAllServices: { path: "/services", method: "GET", secure: true },
  getActiveServices: { path: "/services/active", method: "GET", secure: false },
  getServiceById: {
    path: "/services/:id",
    method: "GET",
    parameterized: true,
    secure: false,
  },
  createService: {
    path: "/services",
    method: "POST",
    secure: true,
  },
  updateService: { path: "/services/update/:id", method: "PUT", secure: true },
  deactiveService: {
    path: "/services/deactive/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  activeService: {
    path: "/services/active/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },

  // Schedule
  getTherapistScheduleByDate: {
    path: "/schedule/therapist/:date",
    method: "GET",
    secure: true,
  },
  getTherapistScheduleById: {
    path: "/schedule/therapist/getById/:id",
    method: "GET",
    secure: true,
  },
  getTherapistScheduleByMonth: {
    path: "/schedule/therapist/month/:id/:month",
    method: "GET",
    secure: true,
  },
  createTherapistSchedule: {
    path: "/schedule/therapist",
    method: "POST",
    secure: true,
  },
  updateTherapistSchedule: {
    path: "/schedule/therapist/update/:id",
    method: "PUT",
    secure: true,
  },
  deleteTherapistSchedule: {
    path: "/schedule/therapist/:id",
    method: "DELETE",
    parameterized: true,
    secure: true,
  },

  // Booking

  getAllBookings: {
    path: "/booking/getallBooking",
    method: "GET",
    secure: true,
  },
  getAvailableSlots: { path: "/booking/slots", method: "POST", secure: true },
  createBooking: {
    path: "/booking/createBooking",
    method: "POST",
    secure: true,
  },
  getCustomerPendingBookings: {
    path: "/booking/customer/:userId/pending",
    method: "GET",
    parameterized: true,
    secure: true,
  },
  getCustomerCompletedBookings: {
    path: "/booking/customer/:userId/completed",
    method: "GET",
    parameterized: true,
    secure: true,
  },
  getCustomerCancelledBookings: {
    path: "/booking/customer/:userId/cancel",
    method: "GET",
    parameterized: true,
    secure: true,
  },
  deleteBooking: {
    path: "/booking/delete/:bookingId",
    method: "DELETE",
    parameterized: true,
    secure: true,
  },
  finishBooking: {
    path: "/booking/:id/finish",
    method: "POST",
    parameterized: true,
    secure: true,
  },
  checkInBooking: {
    path: "/booking/:id/checkin",
    method: "PUT",
    secure: true,
  },
  completeBooking: {
    path: "/booking/:id/finish",
    method: "POST",
    secure: true,
  },
  getBookingByDate: {
    path: "/booking/getBooking/:date",
    method: "POST",
    secure: true,
  },

  checkoutBookingTransaction: {
    path: "/booking/checkout?transactionId=:id",
    method: "PUT",
    secure: true,
  },
  checkoutBooking: {
    path: "/booking/checkout?bookingId=:id",
    method: "PUT",
    secure: true,
  },
  getAllSlots: { path: "/slot/getAllSlot", method: "GET", secure: true },
  getSurveyQuestions: {
    path: "/survey/questions",
    method: "GET",
    secure: true,
  },
  submitFeedback: { path: "/feedback", method: "POST", secure: true },
  payment: {
    path: "/payment/:bookingId",
    method: "GET",
    parameterized: true,
    secure: true,
  },
  checkTherapistAvailability: {
    path: "/booking/therapist/update",
    method: "POST",
    secure: true,
  },
  updateBooking: {
    path: "/booking/update/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  getQrVnpay: {
    path: "/payment/:id",
    method: "GET",
    secure: true,
  },
  // Separate voucher endpoints
  getAllVouchers: {
    path: "/vouchers",
    method: "GET",
    secure: true,
  },
  getActiveVouchers: {
    path: "/vouchers/active",
    method: "GET",
    secure: true,
  },
  createVoucher: {
    path: "/vouchers",
    method: "POST",
    secure: true,
  },
  updateVoucher: {
    path: "/vouchers/update/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  deactivateVoucher: {
    path: "/vouchers/deactive/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },
  activateVoucher: {
    path: "/vouchers/active/:id",
    method: "PUT",
    parameterized: true,
    secure: true,
  },

  countBookings: { path: "/admin/booking/count", method: "GET", secure: true },
  getTotalMoney: {
    path: "/admin/booking/total-money/month",
    method: "GET",
    secure: true,
  },
  countCustomers: {
    path: "/admin/customer/count",
    method: "GET",
    secure: true,
  },
  countServices: { path: "/admin/service/count", method: "GET", secure: true },

  getTherapistByDate: {
    path: "/schedule/therapist/date/:date",
    method: "GET",
    secure: true,
  },
  getVouchers: {
    path: "/vouchers/active",
    method: "GET",
    secure: true,
  },
  createBookingStaff: {
    path: "/staffs/booking",
    method: "POST",
    secure: true,
  },
  updateInfo: {
    path: "/users/update",
    method: "PUT",
    secure: true,
  },
  createUserByStaff: {
    path: "/staffs/customer",
    method: "POST",
    secure: true,
  },
  cancelBooking: {
    path: "/booking/delete/{id}",
    method: "DELETE",
    secure: true,
  },
};

export const ACTIONS = {
  SIGN_IN: "signIn",
  SIGN_IN_GOOGLE: "signInGoogle",
  SIGN_IN_WITH_GOOGLE: "signInGoogle",
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
  CREATE_BOOKING_STAFF: "createBookingStaff",
  GET_THERAPIST_SCHEDULE: "getTherapistSchedule",
  GET_THERAPIST_SCHEDULE_BY_ID: "getTherapistScheduleById",
  GET_VOUCHERS: "getVouchers",
  GET_ALL_THERAPISTS: "getAllTherapists",
  //--------------- SERVICE ACTIONS ----------------
  CREATE_SERVICE: "createService",
  GET_ALL_SERVICES: "getAllServices",
  UPDATE_SERVICE: "updateService",
  DEACTIVE_SERVICE: "deactiveService",
  ACTIVE_SERVICE: "activeService",
  GET_ACTIVE_SERVICES: "getActiveServices",
  GET_SERVICE_BY_ID: "getServiceById",
  //--------------- THERAPIST ACTIONS ----------------
  GET_ALL_THERAPISTS: "getAllTherapists",
  CREATE_THERAPIST: "createTherapist",
  UPDATE_THERAPIST: "updateTherapist",
  DELETE_THERAPIST: "deleteTherapist",
  RESTORE_THERAPIST: "restoreTherapist",
  RESET_PASSWORD: "resetPassword",
  THERAPIST_PROFILE: "therapistProfile",
  CHANGE_PASSWORD_THERAPIST: "changePasswordTherapist",
  GET_THERAPIST_FEEDBACK: "getTherapistFeedback",
  //--------------- STAFF ACTIONS ----------------
  GET_ALL_STAFFS: "getAllStaffs",
  CREATE_STAFF: "createStaff",
  UPDATE_STAFF: "updateStaff",
  DEACTIVATE_STAFF: "deactivateStaff",
  ACTIVATE_STAFF: "activateStaff",
  RESET_STAFF_PASSWORD: "resetStaffPassword",
  GET_STAFF_INFO: "getStaffInfo",
  CHANGE_PASSWORD_STAFF: "changePasswordStaff",
  //--------------- SCHEDULE ACTIONS ----------------
  GET_THERAPIST_SCHEDULE_BY_DATE: "getTherapistScheduleByDate",
  GET_THERAPIST_SCHEDULE_BY_MONTH: "getTherapistScheduleByMonth",
  CREATE_THERAPIST_SCHEDULE: "createTherapistSchedule",
  UPDATE_THERAPIST_SCHEDULE: "updateTherapistSchedule",
  DELETE_THERAPIST_SCHEDULE: "deleteTherapistSchedule",
  //--------------- BOOKING ACTIONS ----------------
  GET_BOOKING_BY_DATE: "getBookingByDate",
  GET_ALL_BOOKINGS: "getAllBookings",
  GET_ALL_SLOTS: "getAllSlots",
  REFRESH_TOKEN: "refreshToken",
  GET_CUSTOMER_PENDING_BOOKINGS: "getCustomerPendingBookings",
  GET_CUSTOMER_COMPLETED_BOOKINGS: "getCustomerCompletedBookings",
  GET_CUSTOMER_CANCELLED_BOOKINGS: "getCustomerCancelledBookings",
  DELETE_BOOKING: "deleteBooking",
  FINISH_BOOKING: "finishBooking",
  SUBMIT_FEEDBACK: "submitFeedback",
  CHECK_THERAPIST_AVAILABILITY: "checkTherapistAvailability",
  PAYMENT: "payment",
  GET_ALL_USERS: "getAllUsers",
  GET_USER_BY_ID: "getUserById",
  CREATE_USER: "createUser",
  DEACTIVATE_USER: "deactivateUser",
  ACTIVATE_USER: "activateUser",
  RESET_USER_PASSWORD: "resetUserPassword",
  CHECKOUT_BOOKING: "checkoutBooking",
  UPDATE_BOOKING: "updateBooking",
  CREATE_USER_BY_STAFF: "createUserByStaff",
  GET_QR_VNPAY: "getQrVnpay",
  CHECKOUT_BOOKING_TRANSACTION: "checkoutBookingTransaction",
  // Separate voucher actions
  GET_ALL_VOUCHERS: "getAllVouchers",
  GET_ACTIVE_VOUCHERS: "getActiveVouchers",
  CREATE_VOUCHER: "createVoucher",
  UPDATE_VOUCHER: "updateVoucher",
  DEACTIVATE_VOUCHER: "deactivateVoucher",
  ACTIVATE_VOUCHER: "activateVoucher",

  GET_THERAPIST_BY_DATE: "getTherapistByDate",
  CHECK_IN_BOOKING: "checkInBooking",
  CANCEL_BOOKING: "cancelBooking",
};

export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  THERAPIST: "THERAPIST",
  CUSTOMER: "CUSTOMER",
};

export const ADMIN_AREA_ROLES = [ROLES.ADMIN, ROLES.STAFF, ROLES.THERAPIST];

export const PAGE_ACCESS = {
  "/admin/dashboard": [ROLES.ADMIN, ROLES.STAFF],
  "/admin/customers": [ROLES.ADMIN, ROLES.STAFF],
  "/admin/bookings": [ROLES.ADMIN, ROLES.STAFF],
  "/admin/schedules": [ROLES.ADMIN, ROLES.STAFF, ROLES.THERAPIST],
  "/admin/therapists": [ROLES.ADMIN],
  "/admin/services": [ROLES.ADMIN],
  "/admin/settings": [ROLES.ADMIN],
  "/admin/staffs": [ROLES.ADMIN],
  "/admin/users": [ROLES.ADMIN],
  "/admin/staff-profile": [ROLES.STAFF],
};
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-api-4d96c0caf8d1.herokuapp.com/api";

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBDR8tHvs2hUTSTf9_TwUz6v8_8S0fXalQ",
  authDomain: "bambospa-c430d.firebaseapp.com",
  projectId: "bambospa-c430d",
  storageBucket: "bambospa-c430d.firebasestorage.app",
  messagingSenderId: "385375331430",
  appId: "1:385375331430:web:1288c1ac8a1d1f2d99f9a7",
  measurementId: "G-WCRPBF0HRJ"
};
