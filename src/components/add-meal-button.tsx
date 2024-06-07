import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";

export const AddMealButton = () => {
  return (
    <Button isIconOnly color="primary" radius="full">
      <TbPlus size={24} />
    </Button>
  );
};
