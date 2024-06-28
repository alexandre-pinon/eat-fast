import type { EmptyMeal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";

export const AddMealButton = ({ meal }: { meal: EmptyMeal }) => {
  const { openModal, setModalState, setActiveMeal } = useModalStore();

  const onPressAddMeal = () => {
    setActiveMeal(meal);
    setModalState("menu");
    openModal();
  };

  return (
    <Button isIconOnly onPress={onPressAddMeal} color="primary" radius="full">
      <TbPlus size={24} />
    </Button>
  );
};
