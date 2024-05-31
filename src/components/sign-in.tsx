import { signIn } from "@/auth";
import { Button, type ButtonVariantProps, Input } from "@nextui-org/react";
import type { BuiltInProviderType } from "next-auth/providers";

type SignInButtonProps = ButtonVariantProps & {
  provider: BuiltInProviderType;
};

export const SignIn = ({
  provider,
  ...buttonVariantProps
}: SignInButtonProps) => {
  return (
    <form
      action={async (formData) => {
        "use server";
        console.log("formData", formData.values());
        await signIn(provider, formData);
      }}
    >
      {provider === "resend" ? (
        <Input type="text" name="email" placeholder="Email" />
      ) : (
        <></>
      )}
      <Button type="submit" {...buttonVariantProps}>
        Signin with {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Button>
    </form>
  );
};
