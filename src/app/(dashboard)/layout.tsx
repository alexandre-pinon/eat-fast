import { SideNav } from "@/components/sidenav";
import type { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="grid grid-cols-[max-content_1fr]">
      <aside>
        <SideNav />
      </aside>
      <main className="bg-white">{children}</main>
    </div>
  );
}
