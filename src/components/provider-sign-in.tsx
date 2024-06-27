"use client";
import { Button } from "@nextui-org/react";
import { type ClientSafeProvider, signIn } from "next-auth/react";
import type { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { match } from "ts-pattern";

export const ProviderSignIn = ({
  provider,
}: { provider: ClientSafeProvider }) => {
  const providerIconMap = (provider: string): ReactNode | undefined =>
    match(provider)
      .with("google", () => <FcGoogle size={16} />)
      .otherwise(() => undefined);

  return (
    <Button
      className="w-full"
      type="submit"
      color="default"
      variant="bordered"
      startContent={providerIconMap(provider.id)}
      onPress={() => signIn(provider.id, { callbackUrl: "/meals-of-the-week" })}
    >
      Sign in with {provider.name}
    </Button>
  );
};
