"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard, FileText, Users } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Forms", href: "/forms", icon: FileText },
    { name: "Employees", href: "/employees", icon: Users },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">EMS Portal</h1>
          <p className="text-sm text-gray-500 capitalize">{user.role}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                pathname.startsWith(item.href) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-red-600 w-full p-2 rounded-md hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
