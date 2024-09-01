import { randomUUID } from "node:crypto";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Spacer,
} from "@nextui-org/react";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { TbCheck } from "react-icons/tb";

export const PricingSection = () => {
  const locale = useLocale();
  const format = useFormatter();

  const t = useTranslations("PricingSection");

  const features = [
    {
      id: randomUUID(),
      label: t("card.feature1"),
    },
    {
      id: randomUUID(),
      label: t("card.feature2"),
    },
    {
      id: randomUUID(),
      label: t("card.feature3"),
    },
  ];

  return (
    <div id="pricing" className="grid justify-items-center gap-y-10">
      <div>{t("tagline")}</div>
      <div className="max-w-2xl text-center space-y-6">
        <h2 className="text-2xl font-semibold leading-tight">{t("heading")}</h2>
        <p>
          {t.rich("subHeading", {
            important: text => <span className="font-semibold">{text}</span>,
          })}
        </p>
      </div>
      <Spacer y={6} />
      <Card className="px-12 py-8">
        <CardHeader className="flex-col">
          <span className="text-lg font-medium">{t("card.plan")}</span>
          <span className="text-3xl font-semibold">
            {format.number(29, {
              style: "currency",
              currency: locale === "fr" ? "EUR" : "USD",
              trailingZeroDisplay: "stripIfInteger",
            })}
          </span>
        </CardHeader>
        <CardBody className="gap-y-3">
          {features.map(feature => (
            <div className="flex gap-x-2 items-center" key={feature.id}>
              <TbCheck size={16} />
              <span>{feature.label}</span>
            </div>
          ))}
        </CardBody>
        <Spacer y={5} />
        <CardFooter>
          <Button
            endContent={
              <Image
                className="w-5"
                src="/fork-and-knife.svg"
                alt="fork and knife"
              />
            }
            className="w-full"
            color="primary"
          >
            {t("card.cta")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
