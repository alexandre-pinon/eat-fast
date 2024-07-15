import type { Ingredient, MealIngredient } from "@/entities/ingredient";
import type { WeekMeal } from "@/entities/meal";
import {
  fetchUserIngredients,
  fetchUserMealIngredients,
} from "@/services/ingredient-service";
import { type MealModalMode, isNormal } from "@/types/meal-modal-state";
import { quantityUnits } from "@/types/quantity-unit";
import { Autocomplete, AutocompleteItem, Skeleton } from "@nextui-org/react";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { TbCircle, TbCirclePlus, TbTrash } from "react-icons/tb";
import { v4 as uuid } from "uuid";

type MealIngredientsInputProps = {
  mode: MealModalMode;
  activeMeal: WeekMeal;
  servings: number;
  userId: string;
};
export const MealIngredientsInput = ({
  mode,
  activeMeal,
  servings,
  userId,
}: MealIngredientsInputProps) => {
  const [mealIngredients, setMealIngredients] = useState<MealIngredient[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const formStatus = useFormStatus();
  const [fetchPending, startFetch] = useTransition();

  const addIngredient = () => {
    setMealIngredients([
      ...mealIngredients,
      {
        id: uuid(),
        userId,
        name: "",
        quantity: 0,
        unit: null,
      },
    ]);
  };

  const removeIngredient = (ingredientId: string) => {
    setMealIngredients(
      mealIngredients.filter(ingredient => ingredient.id !== ingredientId),
    );
  };

  useEffect(() => {
    if (!activeMeal.empty) {
      startFetch(() =>
        fetchUserMealIngredients(activeMeal.id).then(setMealIngredients),
      );
    }
  }, [activeMeal]);

  useEffect(() => {
    fetchUserIngredients(userId).then(setIngredients);
  }, [userId]);

  return (
    <Skeleton
      isLoaded={!formStatus.pending && !fetchPending}
      className="rounded-2xl"
    >
      {isNormal(mode) ? (
        <div className="flex flex-col gap-y-3">
          {mealIngredients.length > 0 ? (
            mealIngredients.map(ingredient => (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                servings={servings}
              />
            ))
          ) : (
            <span className="italic opacity-50">No ingredients added</span>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_1fr_2fr_min-content] gap-x-4 gap-y-2 justify-items-center">
          <span>Quantity</span>
          <span>Unit</span>
          <span>Ingredient</span>
          <span> </span>
          {mealIngredients.map(ingredient => (
            <IngredientInput
              key={ingredient.id}
              ingredient={ingredient}
              servings={servings}
              removeIngredient={removeIngredient}
              ingredients={ingredients}
            />
          ))}
          <Button
            className="pl-2 w-full"
            color="primary"
            variant="light"
            startContent={<TbCirclePlus size={24} />}
            onPress={addIngredient}
          >
            Add ingredient
          </Button>
        </div>
      )}
    </Skeleton>
  );
};

export const IngredientItem = ({
  ingredient,
  servings,
}: { ingredient: MealIngredient; servings: number }) => {
  return (
    <div className="inline-flex gap-x-2 items-center">
      <TbCircle className="text-primary" size={20} />
      <div>
        <span>
          {ingredient.quantity * servings}
          {ingredient.unit ?? ""}{" "}
        </span>
        <span className="capitalize">
          {ingredient.name}
          {!ingredient.unit && ingredient.quantity * servings !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};

export const IngredientInput = ({
  ingredient,
  servings,
  removeIngredient,
  ingredients,
}: {
  ingredient: MealIngredient;
  servings: number;
  removeIngredient: (ingredientId: string) => void;
  ingredients: Ingredient[];
}) => {
  const [quantity, setQuantity] = useState(ingredient.quantity);
  const units = ["", ...quantityUnits];

  return (
    <>
      <Input type="hidden" name="ingredientId" value={ingredient.id} />
      <Input
        color="default"
        variant="flat"
        type="number"
        step="0.1"
        name="quantity"
        value={(quantity * servings).toString()}
        onValueChange={value => setQuantity(+value / servings)}
      />
      <Select
        aria-label="unit"
        color="default"
        variant="flat"
        name="unit"
        defaultSelectedKeys={ingredient.unit ?? ""}
      >
        {units.map(unit => (
          <SelectItem key={unit} textValue={ingredient.unit ?? "no units"}>
            {unit.length ? (
              unit
            ) : (
              <span className="opacity-50 italic">no units</span>
            )}
          </SelectItem>
        ))}
      </Select>
      <Autocomplete
        type="text"
        name="ingredientName"
        aria-label="ingredientName"
        defaultItems={ingredients}
        defaultSelectedKey={ingredient.name}
        allowsCustomValue
      >
        {ingredient => (
          <AutocompleteItem key={ingredient.name}>
            {ingredient.name}
          </AutocompleteItem>
        )}
      </Autocomplete>
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
