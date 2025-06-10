import axios from "axios";

// Just to cleanup fetching from backend
export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
