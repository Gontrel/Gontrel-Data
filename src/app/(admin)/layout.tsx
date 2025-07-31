import Sidebar from "@/components/sidebar/Sidebar";
import { DynamicHeader } from "@/components/admin/DynamicHeader";
import React from "react";

export const metadata = {
  title: "admin sidebar",
  description: "Admin layout with sidebar",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <Sidebar />
      <section className="ms-[300px] transition-all duration-300"><DynamicHeader />{children}</section>
    </main>
  );
};

export default AdminLayout;
