import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "../providers/QueryProvider";

export const metadata: Metadata = {
  title: "Gontrel Admin",
  description: "Manage, monitor and facilatate operation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
