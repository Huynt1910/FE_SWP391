export const RequestMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const END_POINTS = {
  signIn: { path: "/auth/sign-in", method: "POST" },
  signUp: { path: "/auth/sign-up", method: "POST" },
  getSelf: { path: "/users/self", method: "GET", secure: true },
};

export const ACTIONS = {
  SIGN_IN: "signIn",
  SIGN_UP: "signUp",
  GET_SELF: "getSelf",
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
