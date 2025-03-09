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
    console.log("Request URL:", fullUrl);
    console.log("Request data:", data);

    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    return response.json();
  }

  static async invoke(params) {
    const { action, data, query, headers = {} } = params;

    if (!END_POINTS[action]) {
      throw new Error(`Invalid action: ${action}`);
    }

    const endpoint = END_POINTS[action];
    console.log("Endpoint config:", endpoint);

    const token = getCookie("token");
    if (endpoint.secure && token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_URL}${endpoint.path}`;
    console.log("Final URL:", url);

    return this.request(url, endpoint.method, data, headers, query);
  }
}
