import { useModalStore } from "@/hooks/modal-store";
import type { MealType } from "@/types";
import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";

export const AddMealButton = ({ id, type }: { id: string; type: MealType }) => {
  const { openModal, setModalState, setActiveMeal } = useModalStore();

  const onPressAddMeal = () => {
    setActiveMeal({ id, type });
    setModalState("menu");
    openModal();
  };

  return (
    <Button isIconOnly onPress={onPressAddMeal} color="primary" radius="full">
      <TbPlus size={24} />
    </Button>
  );
};
