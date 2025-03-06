export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const END_POINTS = {
  signIn: { path: "/authentication/log-in", method: "POST" },
  signUp: { path: "/users", method: "POST" },
<<<<<<< HEAD
  getSelf: { path: "/users/myInfo", method: "GET", secure: true },
  forgotpassword: {
    path: "/authentication/changeForgotPassword",
=======
  myInfo: { path: "/users/myInfo", method: "GET", secure: true },
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
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
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
<<<<<<< HEAD
  GET_SELF: "getSelf",
  FORGOT_PASSWORD: "forgotpassword",
=======
  FORGOT_PASSWORD_VERIFY_EMAIL: "forgotPasswordVerifyEmail",
  FORGOT_PASSWORD_VERIFY_OTP: "forgotPasswordVerifyOtp",
  FORGOT_PASSWORD_CHANGE: "forgotPasswordChange",
>>>>>>> 036e585c0a1989822418855a48b6b136afee7f46
  GET_SURVEY_QUESTIONS: "getSurveyQuestions",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";
