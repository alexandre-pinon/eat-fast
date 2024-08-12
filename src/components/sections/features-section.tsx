import { randomUUID } from "node:crypto";
import { Spacer } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { FcInspection, FcPlanner, FcServices } from "react-icons/fc";

export const FeaturesSection = () => {
  const icons = [
    <FcPlanner key={randomUUID()} size={48} />,
    <FcInspection key={randomUUID()} size={48} />,
    <FcServices key={randomUUID()} size={48} />,
  ];

  const t = useTranslations("FeaturesSection");

  return (
    <>
      <div id="features" className="grid justify-items-center gap-y-10">
        <div>{t("simplify")}</div>
        <div className="max-w-2xl text-center space-y-6">
          <h2 className="text-2xl font-semibold leading-tight">
            {t("heading")}
          </h2>
          <p>{t("subHeading")}</p>
        </div>
      </div>
      <Spacer y={24} />
      <div className="grid grid-cols-3 text-center gap-x-14">
        {icons.map((icon, i) => (
          <div key={icon.key} className="flex flex-col items-center gap-y-4">
            {icon}
            <h3 className="text-lg font-semibold">
              {
                // @ts-ignore
                t(`feature${i + 1}.heading`)
              }
            </h3>
            <p>
              {
                // @ts-ignore
                t(`feature${i + 1}.subHeading`)
              }
            </p>
          </div>
        ))}
      </div>
    </>
  );
};
