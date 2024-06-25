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

type HistoryMeal = {
  id: string;
  name: string;
};
const historyMeals = [
  {
    id: uuid(),
    name: "Eggs & bacon",
  },
  {
    id: uuid(),
    name: "Fish soup",
  },
  {
    id: uuid(),
    name: "Steak with fries",
  },
  {
    id: uuid(),
    name: "Cereals",
  },
  {
    id: uuid(),
    name: "Pasta salad",
  },
  {
    id: uuid(),
    name: "Mustard chicken with rice",
  },
  {
    id: uuid(),
    name: "Chorizo and mushroom risotto",
  },
] satisfies HistoryMeal[];

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
        ? historyMeals.filter((meal) =>
            meal.name.toLowerCase().includes(filterValue.toLowerCase()),
          )
        : historyMeals,
    [filterValue],
  );

  const onRowAction = (key: Key) => {
    setActiveMeal({
      id: key.toString(),
      type: "lunch",
      title: filteredMeals.find((meal) => meal.id === key)?.name,
    });
    setPrevModalState("history");
    showBackLink();
    setModalState("meal");
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
          {filteredMeals.map((meal) => (
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
