export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const END_POINTS = {
  signIn: { path: "/authentication/log-in", method: "POST" },
  signUp: { path: "/users", method: "POST" },
  myInfo: { path: "/users/myInfo", method: "GET", secure: true },
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
  forgotPasswordVerifyEmail: {
    path: "/forgot-password/verifyEmail",
    method: "POST",
  },
  forgotPasswordVerifyOtp: {
    path: "/forgot-password/verifyOtp",
    method: "POST",
  },
  forgotPasswordChange: {
    path: "/forgot-password/changeForgotPassword",
    method: "POST",
  },
  getSurveyQuestions: {
    path: "/survey/questions",
    method: "GET",
    secure: true,
  },
};

export const ACTIONS = {
  SIGN_IN: "signIn",
  SIGN_UP: "signUp",
  MY_INFO: "myInfo",
  UPDATE_INFO: "updateInfo",
  CHANGE_PASSWORD: "changePassword",
  FORGOT_PASSWORD_VERIFY_EMAIL: "forgotPasswordVerifyEmail",
  FORGOT_PASSWORD_VERIFY_OTP: "forgotPasswordVerifyOtp",
  FORGOT_PASSWORD_CHANGE: "forgotPasswordChange",
  GET_SURVEY_QUESTIONS: "getSurveyQuestions",
};

export const API_URL =
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";
