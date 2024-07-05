import type { Ingredient } from "@/entities/ingredient";
import { quantityUnits } from "@/types/quantity-unit";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { TbCircle, TbTrash } from "react-icons/tb";

export const IngredientItem = ({
  ingredient,
  servings,
}: { ingredient: Ingredient; servings: number }) => {
  return (
    <div className="inline-flex gap-x-2 items-center">
      <TbCircle className="text-primary" size={20} />
      <div>
        <span>
          {ingredient.quantity * servings}
          {ingredient.unit ?? ""}{" "}
        </span>
        <span className="capitalize">{ingredient.name}</span>
      </div>
    </div>
  );
};

export const IngredientInput = ({
  ingredient,
  servings,
  removeIngredient,
}: {
  ingredient: Ingredient;
  servings: number;
  removeIngredient: (ingredientId: string) => void;
}) => {
  return (
    <>
      <Input type="hidden" name="ingredientId" value={ingredient.id} />
      <Input
        color="default"
        variant="flat"
        type="number"
        step="0.1"
        name="quantity"
        defaultValue={(ingredient.quantity * servings).toString()}
      />
      <Select
        aria-label="unit"
        color="default"
        variant="flat"
        name="unit"
        defaultSelectedKeys={ingredient.unit ?? undefined}
      >
        {quantityUnits.map(quantityUnit => (
          <SelectItem key={quantityUnit}>{quantityUnit}</SelectItem>
        ))}
      </Select>
      <Input
        color="default"
        variant="flat"
        type="text"
        name="ingredientName"
        defaultValue={ingredient.name}
      />
      <Button
        isIconOnly
        color="danger"
        variant="light"
        onPress={() => removeIngredient(ingredient.id)}
      >
        <TbTrash size={24} />
      </Button>
    </>
  );
};
