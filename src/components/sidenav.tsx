import { randomUUID } from "node:crypto";
import { Spacer } from "@nextui-org/react";
import { cloneElement } from "react";
import {
  TbCalendarSmile,
  TbSettings,
  TbShoppingBagCheck,
} from "react-icons/tb";
import { Logo } from "./logo";
import { NavLink, type NavLinkProps } from "./nav-link";

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
] satisfies (Omit<NavLinkProps, "size"> & { id: string })[];

export const SideNav = () => {
  return (
    <div className="p-6">
      <Logo size={40} />
      <Spacer y={10} />
      <div className="flex flex-col gap-y-4">
        {links.map(link => {
          const icon = cloneElement(link.icon, { size: 28 });
          return (
            <NavLink
              key={link.id}
              icon={icon}
              label={link.label}
              href={link.href}
            />
          );
        })}
      </div>
    </div>
  );
};
