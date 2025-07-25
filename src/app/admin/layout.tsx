import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-[300px] p-8 w-full">{children}</main>
    </div>
  );
};

export default AdminLayout;
