import { signIn } from "@/auth";
import { Button, type ButtonVariantProps } from "@nextui-org/react";

type SignInButtonProps = ButtonVariantProps;

export const SignIn = ({ ...buttonVariantProps }: SignInButtonProps) => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <Button type="submit" {...buttonVariantProps}>
        Sign in
      </Button>
    </form>
  );
};
