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
  forgotpassword: {
    path: "/authentication/changeForgotPassword",
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
  FORGOT_PASSWORD: "forgotpassword",
  GET_SURVEY_QUESTIONS: "getSurveyQuestions",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com/api";
