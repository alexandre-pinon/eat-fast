import type { Meal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import { getMeals } from "@/services/meal-service";
import { getPlaceHolderImageByType } from "@/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  ModalBody,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState, useTransition } from "react";
import { TbArrowBack } from "react-icons/tb";

export const LeftoverModalContent = () => {
  const {
    setModalState,
    setActiveMeal,
    setPrevModalState,
    showBackLink,
    isBackLinkVisible,
    lastEmptyMeal,
    preferences,
  } = useModalStore();
  const [leftoverMeals, setLeftoverMeals] = useState<Meal[]>([]);
  const [fetchPending, startFetch] = useTransition();

  const onPressBacklink = () => {
    setModalState("menu");
  };

  const addLeftoverMeal = async (meal: Meal) => {
    setActiveMeal({
      ...meal,
      empty: false,
      type: lastEmptyMeal.type,
      weekDay: lastEmptyMeal.weekDay,
    });
    setPrevModalState("leftover");
    showBackLink();
    setModalState("meal");
  };

  useEffect(() => {
    startFetch(() =>
      getMeals({ archived: false, preferences }).then(setLeftoverMeals),
    );
  }, [preferences]);

  return (
    <ModalBody className="p-4">
      {isBackLinkVisible ? (
        <Button isIconOnly variant="light" onPress={onPressBacklink}>
          <TbArrowBack size={32} />
        </Button>
      ) : (
        <></>
      )}
      <span className="text-xl font-semibold">Add leftovers</span>
      {fetchPending ? (
        <Spinner label="Loading..." className="py-8" />
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {leftoverMeals.map(meal => (
            <LeftoverCard
              key={meal.id}
              meal={meal}
              addLeftoverMeal={addLeftoverMeal}
            />
          ))}
        </div>
      )}
    </ModalBody>
  );
};

const LeftoverCard = ({
  meal,
  addLeftoverMeal,
}: { meal: Meal; addLeftoverMeal: (meal: Meal) => void }) => {
  return (
    <Card isPressable onPress={() => addLeftoverMeal(meal)}>
      <CardBody className="p-0">
        <Image
          className="rounded-b-none aspect-video object-cover"
          src={meal.image ?? getPlaceHolderImageByType(meal.type)}
          alt={meal.name}
        />
      </CardBody>
      <CardFooter className="grid justify-items-center">
        <span>{meal.name}</span>
      </CardFooter>
    </Card>
  );
};
