import { upsertMealAction } from "@/actions/meal.actions";
import type { Ingredient } from "@/entities/ingredient";
import { useModalStore } from "@/hooks/modal-store";
import {
  type MealModalMode,
  isAdd,
  isEdit,
  isNormal,
} from "@/types/meal-modal-state";
import { isHistory } from "@/types/modal-state";
import { Button, ButtonGroup, Input, Textarea } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import {
  TbCircleCheck,
  TbCirclePlus,
  TbCircleX,
  TbEditCircle,
  TbMinus,
  TbPlus,
  TbTrash,
} from "react-icons/tb";
import { match } from "ts-pattern";
import { v4 as uuid } from "uuid";
import { IngredientInput, IngredientItem } from "../ingredient";

const getMealIngredients = async (mealId: string): Promise<Ingredient[]> => {
  try {
    const res = await fetch(`/api/meals/${mealId}/ingredients`);
    const json = await res.json();
    if (!res.ok) {
      console.error({ status: res.status, json });
      return [];
    }
    console.log(json);
    return json;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const MealModalForm = ({ userId }: { userId: string }) => {
  const { activeMeal, prevModalState } = useModalStore();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [servings, setServings] = useState(4);
  const [mode, setMode] = useState<MealModalMode>(
    activeMeal.empty || isHistory(prevModalState) ? "add" : "normal",
  );
  const [formState, formAction] = useFormState(
    upsertMealAction.bind(null, {
      mealId: activeMeal.id,
      userId,
      type: activeMeal.type,
      weekDay: activeMeal.weekDay,
    }),
    { mealUpserted: false },
  );

  const mealRecipe = useMemo(
    () => (activeMeal.empty || !activeMeal.recipe ? "" : activeMeal.recipe),
    [activeMeal],
  );

  useEffect(() => {
    if (!activeMeal.empty) {
      getMealIngredients(activeMeal.id).then(setIngredients);
    }
  }, [activeMeal]);
  useEffect(() => {
    console.log({ formState });
  }, [formState]);

  const decrementServings = () => {
    setServings(prevServings =>
      prevServings > 1 ? prevServings - 1 : prevServings,
    );
  };
  const incrementServings = () => {
    setServings(prevServings => prevServings + 1);
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: uuid(), userId, name: "", quantity: 0, unit: null },
    ]);
  };
  const removeIngredient = (ingredientId: string) => {
    setIngredients(
      ingredients.filter(ingredient => ingredient.id !== ingredientId),
    );
  };

  return (
    <form
      action={formAction}
      className="px-10 py-4 grid grid-cols-[1fr_max-content] gap-x-4"
    >
      <div>
        {isNormal(mode) ? (
          <p className="text-xl font-semibold">
            {activeMeal.empty ? `New ${activeMeal.type}` : activeMeal.name}
          </p>
        ) : (
          <Input
            color="default"
            variant="flat"
            type="text"
            name="name"
            defaultValue={activeMeal.empty ? "" : activeMeal.name}
            placeholder="Meal name"
            size="lg"
          />
        )}
        <p className="text-lg font-medium mt-6 mb-4">Ingredients</p>
        {isNormal(mode) ? (
          <div className="flex flex-col gap-y-3">
            {ingredients.length > 0 ? (
              ingredients.map(ingredient => (
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
            {ingredients.map(ingredient => (
              <IngredientInput
                key={ingredient.id}
                ingredient={ingredient}
                servings={servings}
                removeIngredient={removeIngredient}
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
      </div>
      <div className="flex flex-col items-end gap-y-3">
        {match(mode)
          .with("normal", () => (
            <Button
              isIconOnly
              color="primary"
              variant="light"
              onPress={() => setMode("edit")}
            >
              <TbEditCircle size={32} />
            </Button>
          ))
          .with("edit", () => (
            <div className="inline-flex">
              <Button
                isIconOnly
                color="success"
                variant="light"
                onPress={() => setMode("normal")}
              >
                <TbCircleCheck size={32} />
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="light"
                onPress={() => setMode("normal")}
              >
                <TbCircleX size={32} />
              </Button>
            </div>
          ))
          .with("add", () => <></>)
          .exhaustive()}
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
            {servings} servings
          </div>
          <Button isIconOnly color="primary" onPress={incrementServings}>
            <TbPlus />
          </Button>
        </ButtonGroup>
        {isNormal(mode) ? (
          <div>
            <span className="font-medium">Total time : </span>
            <span>{activeMeal.empty ? 0 : activeMeal.time}min</span>
          </div>
        ) : (
          <Input
            color="default"
            variant="flat"
            label="Total time"
            labelPlacement="outside-left"
            endContent={<span className="text-small">min</span>}
            defaultValue={activeMeal.empty ? "0" : activeMeal.time.toFixed()}
            type="number"
            name="time"
            classNames={{
              mainWrapper: "max-w-24",
              label: "font-medium",
            }}
          />
        )}
      </div>
      <div className="col-span-2">
        <p className="text-lg font-medium mt-6 mb-4">Instructions</p>
        {isNormal(mode) ? (
          mealRecipe.length > 0 ? (
            <ul className="list-disc list-inside space-y-4">
              {mealRecipe.split("\n").map(instruction => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          ) : (
            <span className="italic opacity-50">No instructions added</span>
          )
        ) : (
          <Textarea type="text" name="recipe" defaultValue={mealRecipe} />
        )}
      </div>
      <div className="col-span-full mt-10">
        <div className="grid grid-cols-3">
          <div />
          <div className="justify-self-center">
            {isAdd(mode) && (
              <Button type="submit" color="primary" variant="flat" radius="lg">
                Add meal
              </Button>
            )}
          </div>
          <div className="justify-self-end">
            {isEdit(mode) && (
              <Button color="danger" variant="ghost" radius="lg" isIconOnly>
                <TbTrash size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
