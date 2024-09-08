import { Link } from "@/i18n/routing";
import { Divider } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { Logo } from "../logo";

export const Footer = () => {
  const t = useTranslations("Footer");

  return (
    <footer className="p-8">
      <div className="grid justify-items-center">
        <Logo size={40} />
        <div className="flex gap-x-10 pt-8 pb-16">
          <Link color="foreground" href="mailto:support@eat-fast.fr">
            {t("links.support")}
          </Link>
          <Link color="foreground" href="#features">
            {t("links.features")}
          </Link>
          <Link color="foreground" href="#pricing">
            {t("links.pricing")}
          </Link>
        </div>
      </div>
      <Divider />
      <div className="pt-4">
        <span className="text-sm">© 2024 Eat-fast. All rights reserved.</span>
      </div>
    </footer>
  );
};
