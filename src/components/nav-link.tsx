"use client";

import { Link } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export type NavLinkProps = {
  label: "mealsOfTheWeek" | "shoppingList" | "settings";
  icon: JSX.Element;
  href: string;
};

export const NavLink = ({ label, icon, href }: NavLinkProps) => {
  const pathName = usePathname();
  const t = useTranslations("Navigation");

  return (
    <Link
      color={pathName === href ? "primary" : "foreground"}
      className="items-center gap-x-2"
      href={href}
    >
      {icon}
      <span>{t(label)}</span>
    </Link>
  );
};
