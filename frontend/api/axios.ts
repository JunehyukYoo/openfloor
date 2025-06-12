// axios.ts
import axios from "axios";

// Just to cleanup fetching from backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;
