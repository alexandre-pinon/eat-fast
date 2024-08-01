import { archiveMealAction } from "@/actions/archive-meal.action";
import { deleteMealAction } from "@/actions/delete-meal.action";
import type { NonEmptyMeal } from "@/entities/meal";
import { getPlaceHolderImageByType } from "@/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Image,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { TbCheck } from "react-icons/tb";

type MealCardProps = {
  meal: NonEmptyMeal;
  isDragOverlay?: boolean;
};

export const MealCard = ({ meal, isDragOverlay }: MealCardProps) => {
  const [archivePending, startArchive] = useTransition();

  const onPressArchive = () => {
    startArchive(async () => {
      meal.isLeftover
        ? await deleteMealAction(meal.id)
        : await archiveMealAction(meal.id);
    });
  };

  const t = useTranslations();

  return (
    <Card
      className={`bg-primary text-primary-foreground text-start ${isDragOverlay ? "scale-105" : ""}`}
    >
      <CardBody className="relative p-0">
        <Image
          className="rounded-b-none aspect-video object-cover"
          src={meal.image ?? getPlaceHolderImageByType(meal.type)}
          alt={meal.name}
        />
        {meal.isLeftover ? (
          <Chip
            className="absolute z-10 top-1 right-1"
            color="warning"
            variant="solid"
            size="sm"
          >
            {t("leftover")}
          </Chip>
        ) : (
          <></>
        )}
      </CardBody>
      <CardFooter className="grid grid-cols-[1fr_min-content] space-x-2">
        <span className="line-clamp-2 self-start">{meal.name}</span>
        <div className="flex flex-col items-end gap-y-1">
          <span className="font-light text-small">~{meal.time}min</span>
          <Tooltip
            placement="bottom"
            color="default"
            content={t("ToolTips.archiveMeal")}
            delay={300}
          >
            <Button
              className="w-6 h-6 min-w-6"
              isIconOnly
              color="success"
              variant="faded"
              radius="full"
              size="sm"
              isLoading={archivePending}
              onPress={onPressArchive}
            >
              <TbCheck size={16} />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};
