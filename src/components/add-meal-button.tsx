import type { EmptyMeal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";

export const AddMealButton = ({ meal }: { meal: EmptyMeal }) => {
  const { openModal, setModalState, setLastEmptyMeal } = useModalStore();

  const onPressAddMeal = () => {
    setLastEmptyMeal(meal);
    setModalState("menu");
    openModal();
  };

  return (
    <Button isIconOnly onPress={onPressAddMeal} color="primary" radius="full">
      <TbPlus size={24} />
    </Button>
  );
};
