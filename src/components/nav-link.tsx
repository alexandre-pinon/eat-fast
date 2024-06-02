"use client";
import { Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";

export type NavLinkProps = {
  icon: JSX.Element;
  text: string;
  href: string;
};

export const NavLink = ({ icon, text, href }: NavLinkProps) => {
  const pathName = usePathname();

  return (
    <Link
      color={pathName === href ? "primary" : "foreground"}
      className="items-center gap-x-2"
      href={href}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};
