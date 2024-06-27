"use client";
import { Button, type ButtonVariantProps } from "@nextui-org/react";
import { signIn } from "next-auth/react";

type SignInButtonProps = ButtonVariantProps;

export const SignIn = ({ ...buttonVariantProps }: SignInButtonProps) => {
  return (
    <Button
      onPress={() => signIn(undefined, { callbackUrl: "/meals-of-the-week" })}
      {...buttonVariantProps}
    >
      Sign in
    </Button>
  );
};
