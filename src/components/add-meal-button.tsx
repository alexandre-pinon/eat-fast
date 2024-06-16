import { useModalStore } from "@/hooks/modal-store";
import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";

export const AddMealButton = () => {
  const { openModal, setModalState } = useModalStore();

  const handleOnPress = () => {
    setModalState("menu");
    openModal();
  };

  return (
    <Button isIconOnly onPress={handleOnPress} color="primary" radius="full">
      <TbPlus size={24} />
    </Button>
  );
};
