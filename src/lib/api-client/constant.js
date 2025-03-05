export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const END_POINTS = {
  signIn: { path: "/authentication/log-in", method: "POST" },
  signUp: { path: "/auth/sign-up", method: "POST" },
  getSelf: { path: "/users/myInfo", method: "GET", secure: true },
};

export const ACTIONS = {
  SIGN_IN: "signIn",
  SIGN_UP: "signUp",
  GET_SELF: "myInfo",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://skincare-booking-api-3e537a79674f.herokuapp.com";
