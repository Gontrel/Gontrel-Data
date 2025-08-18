import type { Metadata } from "next";
import ClientLayout from "./clientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gontrel Admin",
  description: "Manage, monitor and facilatate operation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
