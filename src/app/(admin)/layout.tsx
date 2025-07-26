import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      <div className="w-[300px] flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
