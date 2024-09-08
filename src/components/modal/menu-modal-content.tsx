import { useModalStore } from "@/hooks/modal-store";
import { Button, ModalBody } from "@nextui-org/react";
import { useTranslations } from "next-intl";
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
    setModalState("leftover");
  };

  const onPressMealHistory = () => {
    setPrevModalState("menu");
    showBackLink();
    setModalState("history");
  };

  const t = useTranslations("MenuModal");

  return (
    <ModalBody className="grid md:grid-cols-3 px-[10px]">
      <Button
        color="default"
        variant="flat"
        className="py-28"
        startContent={<TbHistory size={24} />}
        disableRipple
        onPress={onPressMealHistory}
      >
        {t("addFromHistory")}
      </Button>
      <Button
        color="default"
        variant="flat"
        className="py-28"
        startContent={<TbBrandApple size={24} />}
        disableRipple
        onPress={onPressLeftoverMeal}
      >
        {t("addLeftovers")}
      </Button>
      <Button
        color="primary"
        variant="flat"
        className="py-28"
        startContent={<TbCirclePlus size={24} />}
        disableRipple
        onPress={onPressNewMeal}
      >
        {t("newMeal")}
      </Button>
    </ModalBody>
  );
};
