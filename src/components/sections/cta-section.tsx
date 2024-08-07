import { useTranslations } from "next-intl";
import { SignInButton } from "../sign-in-button";

export const CtaSection = () => {
  const t = useTranslations("CtaSection");

  return (
    <div className="grid grid-cols-2 gap-x-16">
      <h2 className="text-2xl font-semibold leading-tight">{t("heading")}</h2>
      <div className="space-y-6">
        <p>
          {t.rich("subHeading", {
            important: text => <span className="font-semibold">"{text}"</span>,
          })}
        </p>
        <SignInButton text={t("cta")} color="primary" size="lg" />
      </div>
    </div>
  );
};
