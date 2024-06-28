import type { Meal } from "@/entities/meal";
import { useModalStore } from "@/hooks/modal-store";
import {
  Button,
  Input,
  ModalBody,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { type Key, useMemo, useState } from "react";
import { TbArrowBack, TbSearch, TbTrash } from "react-icons/tb";
import { v4 as uuid } from "uuid";

const historyMeals = [
  {
    id: uuid(),
    name: "Eggs & bacon",
    userId: uuid(),
    type: "breakfast",
    weekDay: "monday",
    time: 12,
    image: null,
    recipe: null,
  },
  {
    id: uuid(),
    name: "Fish soup",
    userId: uuid(),
    type: "diner",
    weekDay: "tuesday",
    time: 30,
    image: null,
    recipe: "Mix the fish with the soup",
  },
] satisfies Meal[];

export const HistoryModalContent = () => {
  const [filterValue, setFilterValue] = useState("");
  const {
    setModalState,
    setActiveMeal,
    setPrevModalState,
    showBackLink,
    isBackLinkVisible,
  } = useModalStore();

  const filteredMeals = useMemo(
    () =>
      filterValue.length > 0
        ? historyMeals.filter(meal =>
            meal.name.toLowerCase().includes(filterValue.toLowerCase()),
          )
        : historyMeals,
    [filterValue],
  );

  const onRowAction = (key: Key) => {
    const rowMeal = filteredMeals.find(meal => meal.id === key);
    if (rowMeal) {
      setActiveMeal({ ...rowMeal, empty: false });
      setPrevModalState("history");
      showBackLink();
      setModalState("meal");
    }
  };

  const onPressBacklink = () => {
    setModalState("menu");
  };

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
    </ModalBody>
  );
};
