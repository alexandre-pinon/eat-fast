import { useModalStore } from "@/hooks/modal-store";
import { getPlaceHolderImageByType } from "@/utils";
import { Button, Image, ModalBody, Skeleton } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useMemo } from "react";
import { TbArrowBack } from "react-icons/tb";
import { MealModalForm } from "../forms/meal-modal-form";

export const MealModalContent = () => {
  const session = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect("/signin");
    },
  });
  const { activeMeal, isBackLinkVisible, prevModalState, setModalState } =
    useModalStore();

  const onPressBacklink = () => {
    if (prevModalState) {
      setModalState(prevModalState);
    }
  };

  const mealImage = useMemo(
    () =>
      activeMeal.empty || !activeMeal.image
        ? getPlaceHolderImageByType(activeMeal.type)
        : activeMeal.image,
    [activeMeal],
  );

  return (
    <ModalBody className="p-0">
      {isBackLinkVisible ? (
        <Button
          className="absolute top-3 left-3 z-20"
          isIconOnly
          variant="light"
          onPress={onPressBacklink}
        >
          <TbArrowBack size={40} />
        </Button>
      ) : (
        <></>
      )}
      <Image
        className="rounded-b-none aspect-[3] object-cover"
        src={mealImage}
        alt={activeMeal.empty ? "meal image" : activeMeal.name}
      />
      {session.status === "loading" ? (
        <div className="space-y-6 p-4">
          <Skeleton className="h-10 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
      ) : (
        <MealModalForm userId={session.data.sub} />
      )}
    </ModalBody>
  );
};
