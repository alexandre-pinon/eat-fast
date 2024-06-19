import { useModalStore } from "@/hooks/modal-store";
import type { ModalState, PartialMeal } from "@/types";
import { Button, Modal, ModalBody, ModalContent } from "@nextui-org/react";
import { TbCirclePlus, TbHistory } from "react-icons/tb";
import { match } from "ts-pattern";
import { MealModalContent } from "./meal-modal-content";

export const MealModal = () => {
  const { isModalOpen, closeModal, modalState, setModalState, activeMeal } =
    useModalStore();

  return (
    <Modal
      size="5xl"
      isOpen={isModalOpen}
      onClose={closeModal}
      hideCloseButton
      scrollBehavior="inside"
    >
      <ModalContent>
        {renderModalContent(modalState, setModalState, activeMeal)}
      </ModalContent>
    </Modal>
  );
};

const renderModalContent = (
  modalState: ModalState,
  setModalState: (newModalState: ModalState) => void,
  activeMeal: PartialMeal,
) => {
  return match(modalState)
    .with("meal", () => <MealModalContent activeMeal={activeMeal} />)
    .with("history", () => <HistoryModalContent />)
    .with("menu", () => <MenuModalContent setModalState={setModalState} />)
    .exhaustive();
};

const HistoryModalContent = () => {
  return <ModalBody className="">History modal body</ModalBody>;
};

const MenuModalContent = ({
  setModalState,
}: { setModalState: (newModalState: ModalState) => void }) => {
  return (
    <ModalBody className="grid grid-cols-2 px-2">
      <Button
        color="primary"
        variant="faded"
        className="py-40"
        startContent={<TbCirclePlus size={24} />}
        disableRipple
        onPress={() => setModalState("meal")}
      >
        New meal
      </Button>
      <Button
        color="default"
        variant="faded"
        className="py-40"
        startContent={<TbHistory size={24} />}
        disableRipple
        onPress={() => setModalState("history")}
      >
        Add from history
      </Button>
    </ModalBody>
  );
};
