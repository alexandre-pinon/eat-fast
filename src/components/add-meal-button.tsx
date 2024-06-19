import { useModalStore } from "@/hooks/modal-store";
import type { MealType } from "@/types";
import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";
import { v4 as uuid } from "uuid";

export const AddMealButton = ({ type }: { type: MealType }) => {
  const { openModal, setModalState, setActiveMeal } = useModalStore();

  const handleOnPress = () => {
    setActiveMeal({
      id: uuid(),
      type,
    });
    setModalState("menu");
    openModal();
  };

  return (
    <Button isIconOnly onPress={handleOnPress} color="primary" radius="full">
      <TbPlus size={24} />
    </Button>
  );
};
