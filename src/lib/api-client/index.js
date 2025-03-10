import { getCookie } from "cookies-next";
import { API_URL, END_POINTS } from "./constant";

export class APIClient {
  static async request(url, method, data, headers, query) {
    const queryParams = new URLSearchParams(query || {}).toString();
    const options = {
      method,
      headers: Object.assign(
        {
          "Content-Type": "application/json",
        },
        headers
      ),
      body: data ? JSON.stringify(data) : undefined,
    };

    const fullUrl = `${url}${queryParams ? `?${queryParams}` : ""}`;
    console.log("fullUrl", fullUrl);

    const response = await fetch(fullUrl, options);
    return response.json();
  }

  static async invoke(params) {
    const { action, data, query } = params;

    if (!END_POINTS[action]) {
      throw new Error(`Invalid action: ${action}`);
    }

    console.log("endpointwaction", END_POINTS[action]);

    const { path, method, secure, parameterized } = END_POINTS[action];

    const headers = {};
    if (secure) {
      // Add access token to headers
      const token = getCookie("token");
      // console.log(token);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Handle parameterized paths
    let finalPath = path;
    if (parameterized && data) {
      Object.keys(data).forEach(key => {
        const placeholder = `:${key}`;
        if (finalPath.includes(placeholder)) {
          finalPath = finalPath.replace(placeholder, data[key]);
          // Remove the parameter from data to avoid duplication
          delete data[key];
        }
      });
    }

    const url = `${API_URL}${finalPath}`;

    return this.request(url, method, data, headers, query);
  }
}
