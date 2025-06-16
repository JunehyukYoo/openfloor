// components/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4 overflow-y-auto bg-gray-900 text-white">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
