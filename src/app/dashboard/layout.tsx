"use client";

import React, { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Database, 
  Webhook, 
  GalleryHorizontalEnd,
  LogOut
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  // Navigation items for the sidebar
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Database Connections",
      href: "/dashboard/connections",
      icon: Database
    },
    {
      name: "Indexing Configurations",
      href: "/dashboard/indexing",
      icon: GalleryHorizontalEnd
    },
    {
      name: "Webhooks",
      href: "/dashboard/webhooks",
      icon: Webhook
    }
  ];

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col border-r border-gray-800">
        <div className="p-4">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold text-indigo-400">Blockchain Indexer</h1>
          </Link>
        </div>
        <nav className="flex-1 pt-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center px-4 py-3 text-sm rounded-md transition ${
                    isActive(item.href) 
                      ? "bg-gray-800 text-white font-medium" 
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-800 pt-4 mt-6">
          <div className="flex items-center px-4 py-3">
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3 flex-1">
              <span className="text-sm text-gray-300">Account</span>
            </div>
            <Link
              href="/sign-out"
              className="flex items-center text-rose-400 hover:text-rose-300"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-950 text-gray-100">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 