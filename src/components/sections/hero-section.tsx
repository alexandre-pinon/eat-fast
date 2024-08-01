import { useTranslations } from "next-intl";

export const HeroSection = () => {
  const t = useTranslations("HeroSection");

  return (
    <div className="max-w-lg space-y-10">
      <h1 className="text-4xl font-semibold leading-none">{t("heading")}</h1>
      <p className="text-lg font-medium">{t("subHeading")}</p>
    </div>
  );
};
