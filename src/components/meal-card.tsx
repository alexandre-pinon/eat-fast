import type { MealType } from "@/types";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { match } from "ts-pattern";

export type MealCardProps = {
  type: MealType;
  title: string;
  time: number;
  image?: string;
};

export const MealCard = ({ type, title, time, image }: MealCardProps) => {
  const placeHolderImage = (type: MealType): string =>
    match(type)
      .with("breakfast", () => "/breakfast.jpeg")
      .with("lunch", () => "/lunch.jpeg")
      .with("diner", () => "/diner.jpeg")
      .exhaustive();

  return (
    <Card isPressable className="bg-primary text-primary-foreground text-start">
      <CardBody className="p-0">
        <Image
          className="rounded-b-none"
          src={image ?? placeHolderImage(type)}
          alt={title}
        />
      </CardBody>
      <CardFooter className="grid grid-cols-[1fr_min-content] space-x-2">
        <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
          {title}
        </span>
        <span className="font-light text-small">~{time}min</span>
      </CardFooter>
    </Card>
  );
};
