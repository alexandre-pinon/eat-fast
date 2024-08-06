import { auth } from "@/auth";
import { ToggleBreakfastSwitch } from "@/components/inputs/toggle-breakfast-switch";
import { SignOutButton } from "@/components/sign-out";
import { getPreferencesByUserId } from "@/repositories/user-repository";
import type { LocaleParams } from "@/types";
import { toPromise } from "@/utils";
import { Button, Input, Spacer } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { TbTrash } from "react-icons/tb";

const SettingsPage = async ({ params }: LocaleParams) => {
  unstable_setRequestLocale(params.locale);

  const session = await auth();
  if (!session?.sub || !session.user?.email) {
    redirect("/signin");
  }

  const preferences = await toPromise(getPreferencesByUserId(session.sub));

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <Heading />
        <Spacer y={16} />
        <Input
          className="max-w-xs"
          size="lg"
          isReadOnly
          value={session.user.email}
        />
        <Spacer y={12} />
        <ToggleBreakfastSwitch userId={session.sub} preferences={preferences} />
      </div>
      <div className="grid justify-items-start gap-y-6">
        <SignOutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
};

const Heading = () => {
  const t = useTranslations("SettingsPage");

  return (
    <h1 className="text-4xl font-semibold leading-none">{t("heading")}</h1>
  );
};

const DeleteAccountButton = () => {
  const t = useTranslations("SettingsPage");

  return (
    <Button
      className="uppercase"
      color="danger"
      variant="light"
      startContent={<TbTrash size={24} />}
      isDisabled
    >
      {t("deleteAccount")}
    </Button>
  );
};

export default SettingsPage;
