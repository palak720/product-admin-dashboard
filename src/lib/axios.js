import axios from "axios";

export const TOKEN_KEY = "accessToken";

// 1. One Axios instance for the whole app
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 2. REQUEST interceptor: runs before every request, adds the token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 3. RESPONSE interceptor: runs on every response, handles errors in one place
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Cancelled requests are not real errors (we will use this for search later)
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;

    let message = "Something went wrong. Please try again.";
    if (!error.response) {
      message = "Network error. Check your internet connection.";
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    }

    // Token expired or invalid: clear it and send the user to login.
    // Skip this for the login call itself, because there a 400/401 just means wrong details.
    const isLoginCall = error.config?.url?.includes("/auth/login");
    if (status === 401 && !isLoginCall && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }

    // Every failure now has a clean shape: error.message and error.status
    const cleanError = new Error(message);
    cleanError.status = status;
    return Promise.reject(cleanError);
  }
);

export default api;