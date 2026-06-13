import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/posts"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">📝 Posts</h2>
          <p className="text-sm text-gray-500 mt-1">Manage content</p>
        </Link>
        <Link
          href="/admin/categories"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">📂 Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Organize content</p>
        </Link>
        <Link
          href="/admin/users"
          className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">👥 Users</h2>
          <p className="text-sm text-gray-500 mt-1">Manage users</p>
        </Link>
      </div>
    </div>
  );
}
