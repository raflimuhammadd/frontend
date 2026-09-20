"use client";

import { Sidebar } from "@/presentation/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-0">{children}</main>
    </div>
  );
}
