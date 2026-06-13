import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Folder, Users, LayoutDashboard, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Admin - Headless CMS",
};

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Posts", url: "/admin/posts", icon: FileText },
  { title: "Categories", url: "/admin/categories", icon: Folder },
  { title: "Users", url: "/admin/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50">
        <Sidebar>
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-xl font-bold tracking-tight">Headless CMS</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
             <SidebarMenu>
               <SidebarMenuItem>
                 <SidebarMenuButton asChild className="text-red-600 hover:text-red-700 hover:bg-red-50">
                   <Link href="/login">
                     <LogOut className="h-4 w-4" />
                     <span>Logout</span>
                   </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
