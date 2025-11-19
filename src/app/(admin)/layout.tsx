import Sidebar from "@/components/sidebar/Sidebar";
import { DynamicHeader } from "@/components/admin/DynamicHeader";
import React from "react";

export const metadata = {
  title: "Gontrel Admin",
  description: "Gontrel Admin, monitor, facilitate operations",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen">
      <Sidebar />
      <section className="md:ml-[240px] lg:ml-[260px] transition-all duration-300">
        <DynamicHeader />
        {children}
      </section>
    </main>
  );
};

export default AdminLayout;
