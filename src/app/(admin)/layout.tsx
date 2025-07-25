import { DynamicHeader } from '../../components/admin/DynamicHeader';

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
    <main className="min-h-screen">
      <section className="ms-64 transition-all duration-300">
        <DynamicHeader />
        {children}
      </section>
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-800 text-white z-50">
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <a href="/restaurants" className="hover:underline">
                Restaurants
              </a>
            </li>
            <li>
              <a href="/user-management" className="hover:underline">
                User Management
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </main>
  );
}
