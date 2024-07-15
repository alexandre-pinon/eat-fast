import { useModalStore } from "@/hooks/modal-store";
import { Button, ModalBody } from "@nextui-org/react";
import { TbBrandApple, TbCirclePlus, TbHistory } from "react-icons/tb";

export const MenuModalContent = () => {
  const {
    setModalState,
    showBackLink,
    setPrevModalState,
    lastEmptyMeal,
    setActiveMeal,
  } = useModalStore();

  const onPressNewMeal = () => {
    setPrevModalState("menu");
    showBackLink();
    setActiveMeal(lastEmptyMeal);
    setModalState("meal");
  };

  const onPressLeftoverMeal = () => {
    setPrevModalState("menu");
    showBackLink();
    setModalState("history");
  };

  const onPressMealHistory = () => {
    setPrevModalState("menu");
    showBackLink();
    setModalState("history");
  };

  return (
    <ModalBody className="grid grid-cols-3 px-[10px]">
      <Button
        color="default"
        variant="flat"
        className="py-28"
        startContent={<TbHistory size={24} />}
        disableRipple
        onPress={onPressMealHistory}
      >
        Add from history
      </Button>
      <Button
        color="default"
        variant="flat"
        className="py-28"
        startContent={<TbBrandApple size={24} />}
        disableRipple
        onPress={onPressLeftoverMeal}
      >
        Add leftovers
      </Button>
      <Button
        color="primary"
        variant="flat"
        className="py-28"
        startContent={<TbCirclePlus size={24} />}
        disableRipple
        onPress={onPressNewMeal}
      >
        New meal
      </Button>
    </ModalBody>
  );
};
