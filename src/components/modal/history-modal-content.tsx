import { deleteMealAction } from "@/actions/delete-meal.action";
import type { Meal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import { getMeals } from "@/services/meal-service";
import type { Nullable } from "@/types";
import {
  Button,
  Input,
  ModalBody,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { type Key, useEffect, useMemo, useState, useTransition } from "react";
import { TbArrowBack, TbSearch, TbTrash } from "react-icons/tb";

export const HistoryModalContent = () => {
  const [historyMeals, setHistoryMeals] = useState<Meal[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const [deleteMealId, setDeleteMealId] = useState<Nullable<string>>(null);
  const {
    setModalState,
    setActiveMeal,
    setPrevModalState,
    showBackLink,
    isBackLinkVisible,
    lastEmptyMeal,
  } = useModalStore();
  const [fetchPending, startFetch] = useTransition();
  const [deletePending, startDelete] = useTransition();

  const filteredMeals = useMemo(
    () =>
      filterValue.length > 0
        ? historyMeals.filter(meal =>
            meal.name.toLowerCase().includes(filterValue.toLowerCase()),
          )
        : historyMeals,
    [filterValue, historyMeals],
  );

  const onRowAction = (key: Key) => {
    const rowMeal = filteredMeals.find(meal => meal.id === key);
    if (rowMeal) {
      setActiveMeal({
        ...rowMeal,
        empty: false,
        type: lastEmptyMeal.type,
        weekDay: lastEmptyMeal.weekDay,
      });
      setPrevModalState("history");
      showBackLink();
      setModalState("meal");
    }
  };

  const fetchArchivedMeals = () =>
    startFetch(() => getMeals({ archived: true }).then(setHistoryMeals));

  const removeArchivedMeal = (mealId: string) => {
    setDeleteMealId(mealId);
    startDelete(async () => {
      await deleteMealAction(mealId);
      fetchArchivedMeals();
      setDeleteMealId(null);
    });
  };

  const onPressBacklink = () => {
    setModalState("menu");
  };

  useEffect(() => {
    fetchArchivedMeals();
  }, []);

  const t = useTranslations("HistoryModal");

  return (
    <ModalBody className="p-2">
      {isBackLinkVisible ? (
        <Button isIconOnly variant="light" onPress={onPressBacklink}>
          <TbArrowBack size={32} />
        </Button>
      ) : (
        <></>
      )}
      <div className="flex justify-between py-2 pl-2">
        <span className="text-xl font-semibold">{t("mealHistory")}</span>
        <Input
          className="max-w-xs"
          color="primary"
          variant="faded"
          isClearable
          placeholder={`${t("searchMeal")} ...`}
          startContent={<TbSearch />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
      </div>
      <Skeleton isLoaded={!fetchPending} className="rounded-xl">
        <Table
          removeWrapper
          selectionMode="single"
          aria-label="Meal history table"
          onRowAction={onRowAction}
        >
          <TableHeader>
            <TableColumn>{t("meal")}</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredMeals.map(meal => (
              <TableRow className="cursor-pointer" key={meal.id}>
                <TableCell>{meal.name}</TableCell>
                <TableCell className="text-end">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    isLoading={deletePending && meal.id === deleteMealId}
                    isDisabled={deletePending && meal.id !== deleteMealId}
                    onPress={() => removeArchivedMeal(meal.id)}
                  >
                    <TbTrash size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Skeleton>
    </ModalBody>
  );
};
