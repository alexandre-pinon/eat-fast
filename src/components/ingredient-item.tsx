import type { MealIngredient } from "@/entities/ingredient";
import { TbCircle } from "react-icons/tb";

export const IngredientItem = ({
  ingredient,
  servings,
}: { ingredient: MealIngredient; servings: number }) => {
  const quantity = ingredient.quantity * servings;
  const unit = ingredient.unit ?? "";
  return (
    <div className="inline-flex gap-x-2 items-center">
      <TbCircle className="text-primary" size={20} />
      <div>
        <span>
          {quantity}
          {["tsp", "tbsp"].includes(unit) ? " " : ""}
          {["tsp", "tbsp"].includes(unit) ? `${unit}. ` : `${unit} `}
        </span>
        <span>
          {ingredient.name}
          {!ingredient.unit && (quantity === 0 || quantity > 1) ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
