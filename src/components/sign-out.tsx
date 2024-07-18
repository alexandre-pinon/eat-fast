"use client";

import { Button, type ButtonVariantProps } from "@nextui-org/react";
import { signOut } from "next-auth/react";
import { TbLogout } from "react-icons/tb";

type SignOutButtonProps = ButtonVariantProps;

export const SignOutButton = ({
  ...buttonVariantProps
}: SignOutButtonProps) => {
  return (
    <Button
      className="pl-3 gap-x-3"
      variant="light"
      startContent={<TbLogout transform="scale(-1,1)" size={24} />}
      onPress={() => signOut({ callbackUrl: "/signin" })}
      {...buttonVariantProps}
    >
      Sign out
    </Button>
  );
};
