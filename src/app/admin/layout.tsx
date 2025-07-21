export const metadata = {
  title: "admin sidebar",
  description: "Admin layout with sidebar",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <section>{children}</section>
            <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white">
                <nav className="p-4">
                <ul>
                    <li className="mb-2">
                    <a href="/admin/merchant-management" className="hover:underline">
                        Merchant Management
                    </a>
                    </li>
                    <li>
                    <a href="/admin/user-management" className="hover:underline">
                        User Management
                    </a>
                    </li>
                </ul>
                </nav>  
                </aside>
        </main>
      </body>
    </html>
  );
}
