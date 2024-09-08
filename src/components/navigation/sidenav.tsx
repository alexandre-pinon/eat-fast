import { Spacer } from "@nextui-org/react";
import { headers } from "next/headers";
import { cloneElement } from "react";
import { NavLink, type NavLinkProps } from "./nav-link";
import { SideNavHeader } from "./sidenav-header";

export type LinkProps = Omit<NavLinkProps, "size"> & { id: string };
type SideNavProps = { links: LinkProps[] };

export const SideNav = ({ links }: SideNavProps) => {
  const userAgent = headers().get("user-agent") ?? "";

  return (
    <aside className={"z-20 h-full bg-white rounded-xl shadow-sm"}>
      <div className="p-6">
        <SideNavHeader userAgent={userAgent} />
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
    </aside>
  );
};
