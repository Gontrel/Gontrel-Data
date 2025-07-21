import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
