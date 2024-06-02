import { providerMap, signIn } from "@/auth";
import { Logo } from "@/components/logo";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Spacer,
} from "@nextui-org/react";
import type { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { match } from "ts-pattern";

export default function SignInPage() {
  return (
    <main className="grid place-items-center min-h-screen">
      <Card className="w-full max-w-xl p-4">
        <CardHeader className="justify-center">
          <Logo size={40} />
        </CardHeader>
        <Spacer y={12} />
        <CardBody>
          {Object.values(providerMap).map((provider) => (
            <ProviderSignIn key={provider.id} provider={provider} />
          ))}
        </CardBody>
      </Card>
    </main>
  );
}

const ProviderSignIn = ({
  provider,
}: { provider: (typeof providerMap)[number] }) => {
  const providerIconMap = (provider: string): ReactNode | undefined =>
    match(provider)
      .with("google", () => <FcGoogle size={16} />)
      .otherwise(() => undefined);

  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider.id, { redirectTo: "/meals-of-the-week" });
      }}
    >
      {provider.id === "resend" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-x-2 my-4">
            <Divider className="shrink" />
            <span className="uppercase text-foreground-500">or</span>
            <Divider className="shrink" />
          </div>
          <Input
            color="default"
            type="email"
            name="email"
            placeholder="Email"
          />
          <Button
            className="w-full"
            type="submit"
            color="primary"
            variant="solid"
          >
            Sign in with email
          </Button>
        </div>
      ) : (
        <>
          <Button
            className="w-full"
            type="submit"
            color="default"
            variant="bordered"
            startContent={providerIconMap(provider.id)}
          >
            Sign in with {provider.name}
          </Button>
        </>
      )}
    </form>
  );
};
