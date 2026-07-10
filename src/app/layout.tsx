import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import ClientLayout from "./clientLayout";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
});

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
      <body className={figtree.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
