// import { useState } from "react";
// import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
// import { IoChevronForward, IoChevronBack } from "react-icons/io5";

import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./dashboard/app-sidebar";

const DashboardLayout = () => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="w-screen dark"
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-1 flex-col">
          <div className=" flex flex-1 flex-col gap-2">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
