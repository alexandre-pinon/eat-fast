import { deleteMealAction } from "@/actions/delete-meal.action";
import { upsertMealAction } from "@/actions/upsert-meal.action";
import { useModalStore } from "@/hooks/modal-store";
import {
  type MealModalMode,
  isAdd,
  isEdit,
  isNormal,
} from "@/types/meal-modal-state";
import { isHistory, isLeftover } from "@/types/modal-state";
import { Button, Tooltip } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  TbCircleCheck,
  TbCircleX,
  TbEditCircle,
  TbTrash,
} from "react-icons/tb";
import { match } from "ts-pattern";
import { v4 as uuid } from "uuid";
import { MealIngredientsInput } from "../inputs/meal-ingredients-input";
import { MealInstructionsInput } from "../inputs/meal-instructions-input";
import { MealNameInput } from "../inputs/meal-name-input";
import { MealTimeInput } from "../inputs/meal-time-input";
import { ServingsInput } from "../inputs/servings-input";

export const MealModalForm = ({ userId }: { userId: string }) => {
  const { activeMeal, setActiveMeal, prevModalState, closeModal } =
    useModalStore();

  const [servings, setServings] = useState(activeMeal.servings);
  const [mode, setMode] = useState<MealModalMode>(
    activeMeal.empty || isHistory(prevModalState) || isLeftover(prevModalState)
      ? "add"
      : "normal",
  );

  const [formState, formAction] = useFormState(
    upsertMealAction.bind(null, {
      mealId: isEdit(mode) ? activeMeal.id : uuid(),
      userId,
      type: activeMeal.type,
      weekDay: activeMeal.weekDay,
      servings,
      isLeftover: activeMeal.isLeftover,
    }),
    { mealUpserted: false },
  );
  const [deleteMealPending, startDeleteMeal] = useTransition();

  useEffect(() => {
    if (formState.mealUpserted) {
      setActiveMeal({ ...formState.meal, empty: false });
      setMode("normal");
    }
  }, [formState]);

  const removeMeal = () => {
    startDeleteMeal(async () => {
      await deleteMealAction(activeMeal.id);
      closeModal();
    });
  };

  const t = useTranslations("MealModal");

  return (
    <form
      action={formAction}
      className="px-10 py-4 grid grid-cols-[1fr_max-content] gap-x-4"
    >
      <div>
        <MealNameInput mode={mode} activeMeal={activeMeal} />
        <p className="text-lg font-medium mt-6 mb-4">{t("ingredient")}s</p>
        <MealIngredientsInput
          mode={mode}
          activeMeal={activeMeal}
          servings={servings}
          userId={userId}
        />
      </div>
      <div className="flex flex-col items-end gap-y-3">
        <EditButtons
          mode={mode}
          setMode={setMode}
          isLeftover={activeMeal.isLeftover}
        />
        <ServingsInput
          mode={mode}
          mealId={activeMeal.id}
          servings={servings}
          setServings={setServings}
        />
        <MealTimeInput mode={mode} activeMeal={activeMeal} />
      </div>
      <div className="col-span-2">
        <p className="text-lg font-medium mt-6 mb-4">Instructions</p>
        <MealInstructionsInput mode={mode} activeMeal={activeMeal} />
      </div>
      <div className="col-span-full mt-10">
        <div className="grid grid-cols-3">
          <div />
          <div className="justify-self-center">
            {isAdd(mode) && <AddButton />}
          </div>
          <div className="justify-self-end">
            {(isEdit(mode) || isNormal(mode)) && (
              <Button
                color="danger"
                variant="ghost"
                radius="lg"
                isIconOnly
                onPress={removeMeal}
                isLoading={deleteMealPending}
              >
                <TbTrash size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

const EditButtons = ({
  mode,
  setMode,
  isLeftover,
}: {
  mode: MealModalMode;
  setMode: (mode: MealModalMode) => void;
  isLeftover: boolean;
}) => {
  const { pending } = useFormStatus();

  const t = useTranslations("ToolTips");

  return match(mode)
    .with("normal", () => (
      <Tooltip
        placement="top"
        color="default"
        content={t("cantEditLeftover")}
        delay={300}
        isDisabled={!isLeftover}
      >
        <div>
          <Button
            isIconOnly
            color="primary"
            variant="light"
            onPress={() => setMode("edit")}
            isDisabled={isLeftover}
          >
            <TbEditCircle size={32} />
          </Button>
        </div>
      </Tooltip>
    ))
    .with("edit", () => (
      <div className="inline-flex">
        <Button
          isIconOnly
          color="success"
          variant="light"
          type="submit"
          isLoading={pending}
        >
          <TbCircleCheck size={32} />
        </Button>
        <Button
          isIconOnly
          color="danger"
          variant="light"
          onPress={() => setMode("normal")}
          isDisabled={pending}
        >
          <TbCircleX size={32} />
        </Button>
      </div>
    ))
    .with("add", () => <></>)
    .exhaustive();
};

const AddButton = () => {
  const { pending } = useFormStatus();

  const t = useTranslations("MealModal");

  return (
    <Button
      type="submit"
      color="primary"
      variant="flat"
      radius="lg"
      isLoading={pending}
    >
      {t("addMeal")}
    </Button>
  );
};
