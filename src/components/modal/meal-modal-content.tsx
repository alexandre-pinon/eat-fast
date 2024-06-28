import { useModalStore } from "@/hooks/modal-store";
import { type Ingredient, units } from "@/types";
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
import { useMemo, useState } from "react";
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
import { v4 as uuid } from "uuid";

const ingredientsFetched = [
  {
    id: "0001",
    name: "chicken stock cubes",
    quantity: 0.5,
  },
  {
    id: "0002",
    name: "u-shaped chorizo",
    quantity: 0.125,
  },
  {
    id: "0003",
    name: "rice for risotto",
    quantity: 100,
    unit: "g",
  },
  {
    id: "0004",
    name: "paris muschrooms",
    quantity: 2.5,
  },
  {
    id: "0005",
    name: "parmesan cheese",
    quantity: 25,
    unit: "g",
  },
] satisfies Ingredient[];

export const MealModalContent = () => {
  const { activeMeal, isBackLinkVisible, prevModalState, setModalState } =
    useModalStore();
  const [servings, setServings] = useState(4);
  const [editMode, setEditMode] = useState(false);
  const [ingredients, setIngredients] = useState(ingredientsFetched);

  const decrementServings = () => {
    setServings(prevServings =>
      prevServings > 1 ? prevServings - 1 : prevServings,
    );
  };
  const incrementServings = () => {
    setServings(prevServings => prevServings + 1);
  };

  const confirmEdit = () => {
    setEditMode(false);
  };
  const cancelEdit = () => {
    setEditMode(false);
  };

  const addIngredient = () => {
    setIngredients(prevIngredients => [
      ...prevIngredients,
      { id: uuid(), name: "", quantity: 0 },
    ]);
  };
  const removeIngredient = (ingredientId: string) => {
    setIngredients(prevIngredients =>
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId),
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
          {editMode ? (
            <Input
              color="default"
              variant="flat"
              type="text"
              name="title"
              defaultValue={activeMeal.empty ? "" : activeMeal.name}
              placeholder="Meal title"
              size="lg"
            />
          ) : (
            <p className="text-xl font-semibold">
              {activeMeal.empty ? `New ${activeMeal.type}` : activeMeal.name}
            </p>
          )}
          <p className="text-lg font-medium mt-6 mb-4">Ingredients</p>
          {editMode ? (
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
          ) : (
            <div className="flex flex-col gap-y-3">
              {ingredients.map(ingredient => (
                <IngredientItem
                  key={ingredient.id}
                  ingredient={ingredient}
                  servings={servings}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-y-3">
          {editMode ? (
            <div className="inline-flex">
              <Button
                isIconOnly
                color="success"
                variant="light"
                onPress={confirmEdit}
              >
                <TbCircleCheck size={32} />
              </Button>
              <Button
                isIconOnly
                color="danger"
                variant="light"
                onPress={cancelEdit}
              >
                <TbCircleX size={32} />
              </Button>
            </div>
          ) : (
            <Button
              isIconOnly
              color="primary"
              variant="light"
              onPress={() => setEditMode(true)}
            >
              <TbEditCircle size={32} />
            </Button>
          )}
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
          {editMode ? (
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
          ) : (
            <div>
              <span className="font-medium">Total time : </span>
              <span>{activeMeal.empty ? 0 : activeMeal.time}min</span>
            </div>
          )}
        </div>
        <div className="col-span-2">
          <p className="text-lg font-medium mt-6 mb-4">Instructions</p>
          {editMode ? (
            <Textarea defaultValue={mealRecipe} />
          ) : (
            <ul className="list-disc list-inside space-y-4">
              {mealRecipe.split("\n").map(instruction => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-full justify-self-end mt-10">
          <Button color="danger" variant="ghost" isIconOnly>
            <TbTrash size={20} />
          </Button>
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
        defaultSelectedKeys={ingredient.unit}
      >
        {units.map(unit => (
          <SelectItem key={unit}>{unit}</SelectItem>
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
