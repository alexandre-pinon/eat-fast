import { updateServingsAction } from "@/actions/update-meal-servings.action";
import { type MealModalMode, isAdd } from "@/types/meal-modal-state";
import { Button, ButtonGroup } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { TbMinus, TbPlus } from "react-icons/tb";

type ServingsInputProps = {
  mode: MealModalMode;
  mealId: string;
  servings: number;
  setServings: (servings: number) => void;
};
export const ServingsInput = ({
  mode,
  mealId,
  servings,
  setServings,
}: ServingsInputProps) => {
  const incrementServings = () => {
    if (!isAdd(mode)) {
      updateServingsAction(mealId, servings + 1);
    }
    setServings(servings + 1);
  };

  const decrementServings = () => {
    if (servings <= 1) {
      return;
    }

    if (!isAdd(mode)) {
      updateServingsAction(mealId, servings - 1);
    }
    setServings(servings - 1);
  };

  const t = useTranslations("MealModal");

  return (
    <ButtonGroup>
      <Button
        isIconOnly
        color="primary"
        isDisabled={servings === 1}
        onPress={decrementServings}
      >
        <TbMinus />
      </Button>
      <div className="bg-primary text-primary-foreground text-small h-10 inline-flex items-center px-4">
        {servings} {t("serving")}
        {servings !== 1 ? "s" : ""}
      </div>
      <Button isIconOnly color="primary" onPress={incrementServings}>
        <TbPlus />
      </Button>
    </ButtonGroup>
  );
};
