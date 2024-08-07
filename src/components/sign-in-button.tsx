"use client";

import { Button, type ButtonVariantProps } from "@nextui-org/react";
import { signIn } from "next-auth/react";

type SignInButtonProps = ButtonVariantProps & {
  text: string;
};

export const SignInButton = ({
  text,
  ...buttonVariantProps
}: SignInButtonProps) => {
  return (
    <Button
      onPress={() => signIn(undefined, { callbackUrl: "/meals-of-the-week" })}
      {...buttonVariantProps}
    >
      {text}
    </Button>
  );
};
