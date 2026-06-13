import Link from "next/link";
import { cookies } from "next/headers";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Folder, Users } from "lucide-react";

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/posts">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Posts</CardTitle>
              </div>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:bg-muted transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Folder className="h-5 w-5 text-primary" />
                <CardTitle>Categories</CardTitle>
              </div>
              <CardDescription>Organize your content</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {role === 'ADMIN' && (
          <Link href="/admin/users">
            <Card className="hover:bg-muted transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Users</CardTitle>
                </div>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
