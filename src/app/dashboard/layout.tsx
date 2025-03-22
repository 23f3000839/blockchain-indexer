"use client";

import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Database, 
  Settings, 
  Activity, 
  WebhookIcon,
  GalleryHorizontalEnd,
  BarChart,
  LogOut
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-4 flex flex-col">
        <div className="p-4">
          <h1 className="text-xl font-bold">Blockchain Indexer</h1>
        </div>
        <nav className="flex-1 pt-6">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/connections" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <Database className="mr-3 h-4 w-4" />
                Database Connections
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/indexing" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <GalleryHorizontalEnd className="mr-3 h-4 w-4" />
                Indexing Configurations
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/webhooks" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <WebhookIcon className="mr-3 h-4 w-4" />
                Webhooks
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/monitoring" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <BarChart className="mr-3 h-4 w-4" />
                Monitoring
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/activity" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <Activity className="mr-3 h-4 w-4" />
                Activity Logs
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/settings" 
                className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-slate-800 transition"
              >
                <Settings className="mr-3 h-4 w-4" />
                Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t border-slate-700 pt-4 mt-6">
          <div className="flex items-center px-4 py-3">
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3 flex-1">
              <span className="text-sm">Account</span>
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
      <div className="flex-1 overflow-y-auto">
        
          <div className="flex justify-between items-center">
            <div>
              {/* Top right content */}
            </div>
          </div>
        
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 