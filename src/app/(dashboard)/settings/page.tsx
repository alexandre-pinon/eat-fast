import { auth } from "@/auth";
import { ToggleBreakfastSwitch } from "@/components/inputs/toggle-breakfast-switch";
import { SignOutButton } from "@/components/sign-out";
import { getPreferencesByUserId } from "@/repositories/user-repository";
import { toPromise } from "@/utils";
import { Button, Spacer } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { TbTrash } from "react-icons/tb";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.sub || !session.user?.email) {
    redirect("/signin");
  }

  const preferences = await toPromise(getPreferencesByUserId(session.sub));

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h1 className="text-4xl font-semibold leading-none">Settings</h1>
        <Spacer y={16} />
        <p className="text-lg font-medium">{session.user.email}</p>
        <Spacer y={12} />
        <ToggleBreakfastSwitch userId={session.sub} preferences={preferences} />
      </div>
      <div className="grid justify-items-start gap-y-6">
        <SignOutButton />
        <Button
          className="uppercase"
          color="danger"
          variant="light"
          startContent={<TbTrash size={24} />}
          isDisabled
        >
          Delete account
        </Button>
      </div>
    </div>
  );
}
