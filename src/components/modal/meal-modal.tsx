import { useModalStore } from "@/hooks/modal-store";
import type { ModalState } from "@/types/modal-state";
import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { TbCirclePlus, TbHistory } from "react-icons/tb";
import { match } from "ts-pattern";
import { HistoryModalContent } from "./history-modal-content";
import { MealModalContent } from "./meal-modal-content";

export const MealModal = () => {
  const { isModalOpen, closeModal, modalState } = useModalStore();

  return (
    <Modal
      size="5xl"
      isOpen={isModalOpen}
      onClose={closeModal}
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent>{renderModalContent(modalState)}</ModalContent>
    </Modal>
  );
};

const renderModalContent = (modalState: ModalState) => {
  return match(modalState)
    .with("meal", () => <MealModalContent />)
    .with("history", () => <HistoryModalContent />)
    .with("menu", () => <MenuModalContent />)
    .exhaustive();
};

const MenuModalContent = () => {
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

  const onPressMealHistory = () => {
    setPrevModalState("menu");
    showBackLink();
    setModalState("history");
  };

  return (
    <ModalBody className="grid grid-cols-2 px-2">
      <Button
        color="primary"
        variant="faded"
        className="py-40"
        startContent={<TbCirclePlus size={24} />}
        disableRipple
        onPress={onPressNewMeal}
      >
        New meal
      </Button>
      <Button
        color="default"
        variant="faded"
        className="py-40"
        startContent={<TbHistory size={24} />}
        disableRipple
        onPress={onPressMealHistory}
      >
        Add from history
      </Button>
    </ModalBody>
  );
};
