"use client";

import { useNavStore } from "@/hooks/nav-store";
import { isOnMobileDevice } from "@/utils";
import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
import { Logo } from "../logo";

type SideNavHeaderProps = {
  userAgent: string;
};
export const SideNavHeader = ({ userAgent }: SideNavHeaderProps) => {
  const { isMinimized, toggleMinimized } = useNavStore();

  useEffect(() => {
    if (!isMinimized && isOnMobileDevice(userAgent)) {
      toggleMinimized();
    }
  }, [userAgent]);

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
