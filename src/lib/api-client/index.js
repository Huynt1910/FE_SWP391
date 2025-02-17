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

    const { path, method, secure } = END_POINTS[action];

    const headers = {};
    if (secure) {
      // Add access token to headers
      const access_token = getCookie("access_token");
      // console.log(access_token);
      if (access_token) {
        headers["Authorization"] = `Bearer ${access_token}`;
      }
    }

    const url = `${API_URL}${path}`;

    return this.request(url, method, data, headers, query);
  }
}
