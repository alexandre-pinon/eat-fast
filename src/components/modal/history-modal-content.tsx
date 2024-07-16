import type { Meal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import { getMeals } from "@/services/meal-service";
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
import { type Key, useEffect, useMemo, useState, useTransition } from "react";
import { TbArrowBack, TbSearch, TbTrash } from "react-icons/tb";

export const HistoryModalContent = () => {
  const [historyMeals, setHistoryMeals] = useState<Meal[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const {
    setModalState,
    setActiveMeal,
    setPrevModalState,
    showBackLink,
    isBackLinkVisible,
    lastEmptyMeal,
  } = useModalStore();
  const [fetchPending, startFetch] = useTransition();

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

  const onPressBacklink = () => {
    setModalState("menu");
  };

  useEffect(() => {
    startFetch(() => getMeals({ archived: "true" }).then(setHistoryMeals));
  }, []);

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
        <span className="text-xl font-semibold">Meal history</span>
        <Input
          className="max-w-xs"
          color="primary"
          variant="faded"
          isClearable
          placeholder="Search meal..."
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
            <TableColumn>Meal</TableColumn>
            <TableColumn> </TableColumn>
          </TableHeader>
          <TableBody>
            {filteredMeals.map(meal => (
              <TableRow className="cursor-pointer" key={meal.id}>
                <TableCell>{meal.name}</TableCell>
                <TableCell className="text-end">
                  <Button isIconOnly color="danger" variant="light">
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
