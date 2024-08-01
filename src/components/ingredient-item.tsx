"use client";

import { toggleMealIngredientCheckAction } from "@/actions/toggle-meal-ingredient-check.action";
import type { MealIngredient } from "@/entities/ingredient";
import { Checkbox } from "@nextui-org/react";
import { useTranslations } from "next-intl";

export const IngredientItem = ({
  mealIngredient,
  servings,
  mealId,
  lineThrough = false,
}: {
  mealIngredient: MealIngredient;
  servings: number;
  mealId: string | null;
  lineThrough?: boolean;
}) => {
  const quantity = mealIngredient.quantity * servings;
  const unit = mealIngredient.unit ?? "";

  const onCheckboxValueChange = async (checked: boolean) => {
    await toggleMealIngredientCheckAction(
      mealIngredient.id,
      mealIngredient.unit,
      mealId,
      checked,
    );
  };

  const t = useTranslations("MealModal");

  return (
    <Checkbox
      color="primary"
      radius="full"
      lineThrough={lineThrough}
      defaultSelected={mealIngredient.checked}
      onValueChange={onCheckboxValueChange}
    >
      <div>
        <span>
          {quantity}
          {["tsp", "tbsp"].includes(unit) ? " " : ""}
          {unit !== "" ? t(`quantityUnit.${unit}`) : ""}{" "}
        </span>
        <span>
          {mealIngredient.name}
          {!mealIngredient.unit && (quantity === 0 || quantity > 1) ? "s" : ""}
        </span>
      </div>
    </Checkbox>
  );
};
