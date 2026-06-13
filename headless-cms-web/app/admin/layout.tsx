import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin - Headless CMS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-lg font-bold border-b border-gray-700">
          Headless CMS
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin/posts"
            className="block px-3 py-2 rounded hover:bg-gray-700 text-sm"
          >
            📝 Posts
          </Link>
          <Link
            href="/admin/categories"
            className="block px-3 py-2 rounded hover:bg-gray-700 text-sm"
          >
            📂 Categories
          </Link>
          <Link
            href="/admin/users"
            className="block px-3 py-2 rounded hover:bg-gray-700 text-sm"
          >
            👥 Users
          </Link>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
