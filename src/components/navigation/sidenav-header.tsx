"use client";

import { useNavStore } from "@/hooks/nav-store";
import { Button } from "@nextui-org/react";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
import { Logo } from "../logo";

export const SideNavHeader = () => {
  const { isMinimized, toggleMinimized } = useNavStore();

  return (
    <div className="flex items-center justify-between">
      {isMinimized ? (
        <Button isIconOnly variant="light" onClick={() => toggleMinimized()}>
          <TbArrowBarRight size={28} />
        </Button>
      ) : (
        <>
          <Logo size={40} />
          <Button isIconOnly variant="light" onClick={() => toggleMinimized()}>
            <TbArrowBarLeft size={28} />
          </Button>
        </>
      )}
    </div>
  );
};
