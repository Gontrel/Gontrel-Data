"use client";

import { QueryProvider } from "../providers/QueryProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOnline, isSlow } = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("You are offline. Some features may not work.", {
        duration: Infinity,
        id: "offline-toast",
      });
    } else {
      toast.dismiss("offline-toast");
    }

    if (isSlow) {
      toast.loading("Slow network detected. Loading may take longer...", {
        id: "slow-toast",
      });
    } else {
      toast.dismiss("slow-toast");
    }
  }, [isOnline, isSlow]);

  return (
    <QueryProvider>
      <ToasterProvider />
      {children}
    </QueryProvider>
  );
}
