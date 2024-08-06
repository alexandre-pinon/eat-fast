import { Logo } from "@/components/logo";
import { ProviderSignIn } from "@/components/provider-sign-in";
import type { LocaleParams } from "@/types";
import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Spacer,
} from "@nextui-org/react";
import { getProviders } from "next-auth/react";
import { unstable_setRequestLocale } from "next-intl/server";

const SignInPage = async ({ params }: LocaleParams) => {
  unstable_setRequestLocale(params.locale);

  const providers = await getProviders();

  return (
    <main className="grid place-items-center min-h-screen">
      <Card className="w-full max-w-xl p-4">
        <CardHeader className="justify-center">
          <Logo size={40} />
        </CardHeader>
        <Spacer y={12} />
        <CardBody>
          {providers ? (
            Object.values(providers).map(provider => (
              <ProviderSignIn key={provider.id} provider={provider} />
            ))
          ) : (
            <Skeleton className="w-full h-10 rounded-lg" />
          )}
        </CardBody>
      </Card>
    </main>
  );
};

export default SignInPage;
