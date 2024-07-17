import { SideNav } from "@/components/sidenav";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-3 m-3 min-h-[calc(100vh-1.5rem)]">
      <aside className="bg-white rounded-xl shadow-xl">
        <SideNav />
      </aside>
      <main className="bg-white px-10 py-12 rounded-xl shadow-xl">
        {children}
      </main>
    </div>
  );
}
