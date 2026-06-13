import Link from "next/link";
import { cookies } from "next/headers";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileText, Folder, Users, Briefcase } from "lucide-react";

async function fetchCount(endpoint: string, token?: string) {
  if (!token) return 0;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/${endpoint}?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store'
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.meta?.total || 0;
  } catch {
    return 0;
  }
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  let role = 'USER';
  
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = Buffer.from(payloadBase64, 'base64').toString();
      const payload = JSON.parse(payloadJson);
      role = payload.role || 'USER';
    } catch (e) {
      console.error('Failed to parse token in page', e);
    }
  }

  const [postsCount, categoriesCount, usersCount, projectsCount] = await Promise.all([
    fetchCount('posts', token),
    fetchCount('categories', token),
    role === 'ADMIN' ? fetchCount('users', token) : Promise.resolve(0),
    fetchCount('projects', token),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/posts">
          <Card className="hover:bg-muted transition-colors h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Posts</CardTitle>
              </div>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{postsCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/projects">
          <Card className="hover:bg-muted transition-colors h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <CardTitle>Projects</CardTitle>
              </div>
              <CardDescription>Manage portfolio items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projectsCount}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:bg-muted transition-colors h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                <CardTitle>Categories</CardTitle>
              </div>
              <CardDescription>Organize your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categoriesCount}</div>
            </CardContent>
          </Card>
        </Link>

        {role === 'ADMIN' && (
          <Link href="/admin/users">
            <Card className="hover:bg-muted transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Users</CardTitle>
                </div>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{usersCount}</div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
