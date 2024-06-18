import { useModalStore } from "@/hooks/modal-store";
import type { Ingredient, Meal, ModalState, Nullable } from "@/types";
import { getPlaceHolderImageByType } from "@/utils";
import {
  Button,
  ButtonGroup,
  Image,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { useState } from "react";
import {
  TbCircle,
  TbCirclePlus,
  TbEditCircle,
  TbHistory,
  TbMinus,
  TbPlus,
} from "react-icons/tb";
import { match } from "ts-pattern";

const ingredients = [
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
const instructions =
  "Prepare the chicken broth by dissolving the two cubes in 1.5 liters of water, and let it simmer.\nSlice the mushrooms and cut the chorizo into quarter slices.\nBrown the chorizo in a pot without adding any fat, until it has reduced well and is nicely colored.\nSet aside the chorizo, keeping the rendered oil in the pot.\nWithout rinsing the rice, add it to the pot. Stir it with a wooden spoon until it turns orange and starts to heat through.\nKeeping the pot over medium heat, cover the rice with simmering broth and let it reduce, stirring occasionally.";

export const MealModal = () => {
  const { isModalOpen, closeModal, modalState, activeMeal } = useModalStore();

  return (
    <Modal
      size="5xl"
      isOpen={isModalOpen}
      onClose={closeModal}
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent>{renderModalContent(modalState, activeMeal)}</ModalContent>
    </Modal>
  );
};

const renderModalContent = (
  modalState: ModalState,
  activeMeal: Nullable<Meal>,
) => {
  return match(modalState)
    .with("meal", () => <MealModalContent activeMeal={activeMeal} />)
    .with("history", () => <HistoryModalContent />)
    .with("menu", () => <MenuModalContent />)
    .exhaustive();
};

const MealModalContent = ({ activeMeal }: { activeMeal: Nullable<Meal> }) => {
  const [servings, setServings] = useState(4);

  const decrementServings = () => {
    setServings((prevServings) => prevServings - 1);
  };
  const incrementServings = () => {
    setServings((prevServings) => prevServings + 1);
  };

  return activeMeal ? (
    <ModalBody className="p-0">
      <Image
        className="rounded-b-none aspect-[3] object-cover"
        src={activeMeal.image ?? getPlaceHolderImageByType(activeMeal.type)}
        alt={activeMeal.title}
      />
      <div className="px-10 py-4 grid grid-cols-[1fr_max-content]">
        <div>
          <p className="text-xl font-semibold">{activeMeal.title}</p>
          <p className="text-lg font-medium mt-6 mb-4">Ingredients</p>
          <div className="flex flex-col gap-y-3">
            {ingredients.map((ingredient) => (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                servings={servings}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-end gap-y-3">
          <Button isIconOnly color="primary" variant="light">
            <TbEditCircle size={32} />
          </Button>
          <ButtonGroup>
            <Button isIconOnly color="primary" onPress={decrementServings}>
              <TbMinus />
            </Button>
            <div className="bg-primary text-primary-foreground text-small h-10 inline-flex items-center px-4">
              {servings} servings
            </div>
            <Button isIconOnly color="primary" onPress={incrementServings}>
              <TbPlus />
            </Button>
          </ButtonGroup>
          <div>
            <span className="font-medium">Total time : </span>
            <span>~ {activeMeal.time}min</span>
          </div>
        </div>
        <div className="col-span-2">
          <p className="text-lg font-medium mt-6 mb-4">Instructions</p>
          <ul className="list-disc list-inside space-y-4">
            {instructions.split("\n").map((instruction) => (
              <li key={instruction}>{instruction}</li>
            ))}
          </ul>
        </div>
      </div>
    </ModalBody>
  ) : (
    <ModalBody>No active meal.</ModalBody>
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

const HistoryModalContent = () => {
  return <ModalBody className="">History modal body</ModalBody>;
};

const MenuModalContent = () => {
  return (
    <ModalBody className="grid grid-cols-2 px-2">
      <Button
        color="primary"
        variant="faded"
        className="py-40"
        startContent={<TbCirclePlus size={24} />}
        disableRipple
      >
        New meal
      </Button>
      <Button
        color="default"
        variant="faded"
        className="py-40"
        startContent={<TbHistory size={24} />}
        disableRipple
      >
        Add from history
      </Button>
    </ModalBody>
  );
};
