import { Image, Spacer } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { SignInButton } from "../sign-in-button";

export const HeroSection = () => {
  const t = useTranslations("HeroSection");

  return (
    <div className="grid justify-items-center gap-y-6">
      <div className="max-w-2xl space-y-16 text-center">
        <h1 className="text-4xl font-semibold leading-tight">{t("heading")}</h1>
        <p className="text-lg font-medium">{t("subHeading")}</p>
      </div>
      <div>
        <SignInButton text={t("cta")} color="primary" size="lg" />
      </div>
      <Spacer y={16} />
      <Image
        className="aspect-video object-cover"
        src={"/eat-fast-preview.svg"}
        alt={"eat-fast preview"}
      />
    </div>
  );
};
