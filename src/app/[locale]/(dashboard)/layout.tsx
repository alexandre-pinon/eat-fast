import { randomUUID } from "node:crypto";
import { type LinkProps, SideNav } from "@/components/navigation/sidenav";
import type { ReactNode } from "react";
import {
  TbCalendarSmile,
  TbSettings,
  TbShoppingBagCheck,
} from "react-icons/tb";

const links = [
  {
    id: randomUUID(),
    label: "mealsOfTheWeek",
    icon: <TbCalendarSmile />,
    href: "/meals-of-the-week",
  },
  {
    id: randomUUID(),
    label: "shoppingList",
    icon: <TbShoppingBagCheck />,
    href: "/shopping-list",
  },
  {
    id: randomUUID(),
    label: "settings",
    icon: <TbSettings />,
    href: "/settings",
  },
] satisfies LinkProps[];

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="relative grid grid-cols-[max-content_1fr] gap-3 xl:m-3 min-h-screen xl:min-h-[calc(100vh-1.5rem)]">
      <SideNav links={links} />
      <main className="bg-white px-10 py-12 rounded-xl shadow-sm">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
