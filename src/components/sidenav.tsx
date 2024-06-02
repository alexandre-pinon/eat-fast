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
    id: "meals-of-the-week",
    text: "Meals of the week",
    icon: <TbCalendarSmile />,
    href: "/meals-of-the-week",
  },
  {
    id: "shopping-list",
    text: "Shopping list",
    icon: <TbShoppingBagCheck />,
    href: "/shopping-list",
  },
  {
    id: "settings",
    text: "Settings",
    icon: <TbSettings />,
    href: "/settings",
  },
] satisfies (Omit<NavLinkProps, "size"> & { id: string })[];

export const SideNav = () => {
  return (
    <div className="bg-background p-6">
      <Logo size={40} />
      <Spacer y={10} />
      <div className="flex flex-col gap-y-4">
        {links.map((link) => {
          const icon = cloneElement(link.icon, { size: 28 });
          return (
            <NavLink
              key={link.id}
              icon={icon}
              text={link.text}
              href={link.href}
            />
          );
        })}
      </div>
    </div>
  );
};
