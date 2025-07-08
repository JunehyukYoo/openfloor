// axios.ts
import axios from "axios";

// Just to cleanup fetching from backend
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_BASE_URL
      : "/api", // use Vercel rewrites in prod for Safari and icognito cross-origin cookie issues
  withCredentials: true,
});

export default api;
