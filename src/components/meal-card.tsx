import type { MealType } from "@/types";
import { getPlaceHolderImageByType } from "@/utils";
import { Button, Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { TbCheck } from "react-icons/tb";

type MealCardProps = {
  type: MealType;
  title: string;
  time: number;
  image?: string;
  isDragOverlay?: boolean;
};

export const MealCard = ({
  type,
  title,
  time,
  image,
  isDragOverlay,
}: MealCardProps) => {
  return (
    <Card
      className={`bg-primary text-primary-foreground text-start ${isDragOverlay ? "scale-105" : ""}`}
    >
      <CardBody className="relative p-0">
        <Image
          className="rounded-b-none aspect-video object-cover"
          src={image ?? getPlaceHolderImageByType(type)}
          alt={title}
        />
      </CardBody>
      <CardFooter className="grid grid-cols-[1fr_min-content] space-x-2">
        <span className="line-clamp-2 self-start">{title}</span>
        <div className="flex flex-col items-end gap-y-1">
          <span className="font-light text-small">~{time}min</span>
          <Button
            className="w-6 h-6 min-w-6"
            isIconOnly
            color="primary"
            variant="faded"
            radius="full"
            size="sm"
          >
            <TbCheck size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
