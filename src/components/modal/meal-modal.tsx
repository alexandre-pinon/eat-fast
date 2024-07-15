import { useModalStore } from "@/hooks/modal-store";
import type { ModalState } from "@/types/modal-state";
import { Modal, ModalContent } from "@nextui-org/react";
import { match } from "ts-pattern";
import { HistoryModalContent } from "./history-modal-content";
import { MealModalContent } from "./meal-modal-content";
import { MenuModalContent } from "./menu-modal-content";

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
