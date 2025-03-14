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
  };
  
  export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";