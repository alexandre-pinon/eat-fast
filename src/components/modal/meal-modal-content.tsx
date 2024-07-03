import type { Ingredient } from "@/entities/ingredient";
import { useModalStore } from "@/hooks/modal-store";
import {
  type MealModalMode,
  isAdd,
  isEdit,
  isNormal,
} from "@/types/meal-modal-state";
import { isHistory } from "@/types/modal-state";
import { quantityUnits } from "@/types/quantity-unit";
import { getPlaceHolderImageByType } from "@/utils";
import {
  Button,
  ButtonGroup,
  Image,
  Input,
  ModalBody,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  TbArrowBack,
  TbCircle,
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

export const MealModalContent = () => {
  const session = useSession();
  const { activeMeal, isBackLinkVisible, prevModalState, setModalState } =
    useModalStore();

  const [servings, setServings] = useState(4);
  const [mode, setMode] = useState<MealModalMode>(
    activeMeal.empty || isHistory(prevModalState) ? "add" : "normal",
  );
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    if (!activeMeal.empty) {
      getMealIngredients(activeMeal.id).then(setIngredients);
    }
  }, [activeMeal]);

  const decrementServings = () => {
    setServings(prevServings =>
      prevServings > 1 ? prevServings - 1 : prevServings,
    );
  };
  const incrementServings = () => {
    setServings(prevServings => prevServings + 1);
  };

  const addIngredient = () => {
    match(session)
      .with({ status: "authenticated" }, ({ data }) => {
        setIngredients([
          ...ingredients,
          { id: uuid(), userId: data.sub, name: "", quantity: 0, unit: null },
        ]);
      })
      .otherwise(() => {});
  };
  const removeIngredient = (ingredientId: string) => {
    setIngredients(
      ingredients.filter(ingredient => ingredient.id !== ingredientId),
    );
  };

  const onPressBacklink = () => {
    if (prevModalState) {
      setModalState(prevModalState);
    }
  };

  const mealImage = useMemo(
    () =>
      activeMeal.empty || !activeMeal.image
        ? getPlaceHolderImageByType(activeMeal.type)
        : activeMeal.image,
    [activeMeal],
  );
  const mealRecipe = useMemo(
    () => (activeMeal.empty || !activeMeal.recipe ? "" : activeMeal.recipe),
    [activeMeal],
  );

  return (
    <ModalBody className="p-0">
      {isBackLinkVisible ? (
        <Button
          className="absolute top-3 left-3 z-20"
          isIconOnly
          variant="light"
          onPress={onPressBacklink}
        >
          <TbArrowBack size={40} />
        </Button>
      ) : (
        <></>
      )}
      <Image
        className="rounded-b-none aspect-[3] object-cover"
        src={mealImage}
        alt={activeMeal.empty ? "meal image" : activeMeal.name}
      />
      <form className="px-10 py-4 grid grid-cols-[1fr_max-content] gap-x-4">
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
              name="title"
              defaultValue={activeMeal.empty ? "" : activeMeal.name}
              placeholder="Meal title"
              size="lg"
            />
          )}
          <p className="text-lg font-medium mt-6 mb-4">Ingredients</p>
          {isNormal(mode) ? (
            <div className="flex flex-col gap-y-3">
              {ingredients.map(ingredient => (
                <IngredientItem
                  key={ingredient.id}
                  ingredient={ingredient}
                  servings={servings}
                />
              ))}
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
            <ul className="list-disc list-inside space-y-4">
              {mealRecipe.split("\n").map(instruction => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          ) : (
            <Textarea defaultValue={mealRecipe} />
          )}
        </div>
        <div className="col-span-full mt-10">
          <div className="grid grid-cols-3">
            <div />
            <div className="justify-self-center">
              {isAdd(mode) && (
                <Button color="primary" variant="flat" radius="lg">
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
    </ModalBody>
  );
};

const IngredientItem = ({
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

const IngredientInput = ({
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
        name="name"
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
