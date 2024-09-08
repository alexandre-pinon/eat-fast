"use client";

import { useNavStore } from "@/hooks/nav-store";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export type NavLinkProps = {
  label: "mealsOfTheWeek" | "shoppingList" | "settings";
  icon: JSX.Element;
  href: string;
};

export const NavLink = ({ label, icon, href }: NavLinkProps) => {
  const pathName = usePathname();
  const { isMinimized } = useNavStore();

  const t = useTranslations("Navigation");

  return (
    <Link
      color={pathName === href ? "primary" : "foreground"}
      className={[
        `${isMinimized ? "justify-center" : ""}`,
        "flex items-center gap-x-2",
      ].join(" ")}
      href={href}
    >
      {icon}
      {!isMinimized && <span>{t(label)}</span>}
    </Link>
  );
};
