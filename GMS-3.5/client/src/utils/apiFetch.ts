import { API_BASE_URL } from './api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const defaultOptions: RequestInit = {
    ...options,
    credentials: "include", // Keep cookies trying
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      // Add the token as a fallback in case cookies are blocked
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
  return response;
};