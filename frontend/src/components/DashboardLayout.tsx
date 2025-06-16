import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-30 shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      <button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        className={`absolute top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${
          isSidebarOpen ? "left-64" : "left-0"
        }`}
      >
        <div className="w-6 h-16 bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center rounded-r-full shadow-md">
          {isSidebarOpen ? (
            <IoChevronBack className="text-lg" />
          ) : (
            <IoChevronForward className="text-lg" />
          )}
        </div>
      </button>

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col bg-[#282828] text-white transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
