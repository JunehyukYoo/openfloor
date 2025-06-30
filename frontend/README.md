# 🌐 Frontend - OpenFloor

## 📝 Overview

The frontend is built using **React (Vite)** and is fully integrated with the Express backend API. It uses:

- **Context API** for authentication state management.
- **React Hooks** for data fetching and state handling.
- **Custom API helper** using Axios for streamlined backend communication.

The project is deployed on **Vercel** for fast, CDN-based global delivery.

## 🚀 Key Strategies & Patterns

### ✅ Authentication State Management

- Managed using **React Context API** with a custom `AuthProvider`.
- Automatically validates user sessions via backend `/me` route.
- Includes **session invalidation handling** for expired or invalid cookies.

### ✅ API Communication

- All API requests are made via a centralized **Axios instance** with `withCredentials: true` to support session-based authentication.
- Uses environment variables to dynamically set the API base URL based on deployment environment.

### ✅ Routing

- Utilizes **React Router** for client-side routing.
- Includes dynamic routes for debates, user profiles, and more.
- Supports **Single Page Application (SPA) rewrites** on Vercel via `vercel.json`.

### ✅ Session Persistence

- Relies on server-side session cookies for persistent login.
- Uses `credentials: "include"` in all requests to ensure cookies are passed.

### ✅ Defensive UI

- Uses loading spinners (`isLoading` state) to prevent rendering protected pages until authentication status is confirmed.
- Handles invalid sessions by automatically logging the user out and redirecting to the homepage.

## 📂 Environment Setup

### Create a `.env` file:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CDN_DOMAIN=https://YOUR_CLOUD_FRONT_DOMAIN.cloudfront.net
```

### 🔑 Notes:

- Make sure the **URL includes `https://` and does not have a trailing slash.**
- On Vercel, set the `VITE_API_BASE_URL` environment variable in the project settings.

## 🚀 Running Locally

```bash
npm install
npm run dev
```

✅ This starts the Vite development server (default: `http://localhost:5173`).

## 🚀 Deployment Notes

- Deployed on **Vercel** with automatic GitHub integration.
- SPA routing is supported via `vercel.json` rewrite configuration:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

✅ This ensures client-side routing works on page refresh.

### Environment Variable on Vercel:

```dotenv
VITE_API_BASE_URL=https://your-backend-production.up.railway.app/api
```

## ✅ Key Deployment Checklist:

- API base URL configured in Vercel.
- `vercel.json` added to project root for SPA routing.
- `withCredentials: true` set in Axios instance.
- Backend CORS origin matches Vercel frontend URL.

## 🛠️ Tech Stack

- **React (Vite)** (frontend framework)
- **React Router** (client-side routing)
- **Axios** (HTTP requests)
- **Context API** (auth and global state management)
- **React Hooks** (custom hooks for data fetching, session checking)
- **Vercel** (deployment)

## ✅ Additional Recommendations

- Consider adding **route guards** to block access to protected routes for unauthenticated users.
- Consider adding **error boundaries** to gracefully handle unexpected UI crashes.
- Optionally add **custom 404 pages** for better UX.
