import { Button } from "@nextui-org/react";
import { TbPlus } from "react-icons/tb";

export const AddMealButton = () => {
  return (
    <div className="flex-grow flex justify-center items-center">
      <Button isIconOnly color="primary" radius="full">
        <TbPlus size={24} />
      </Button>
    </div>
  );
};
