import { auth } from "@/auth";
import { ToggleBreakfastSwitch } from "@/components/inputs/toggle-breakfast-switch";
import { getPreferencesByUserId } from "@/repositories/user-repository";
import { toPromise } from "@/utils";
import { Spacer } from "@nextui-org/react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.sub || !session.user?.email) {
    redirect("/signin");
  }

  const preferences = await toPromise(getPreferencesByUserId(session.sub));
  console.log(preferences);

  return (
    <div>
      <h1 className="text-4xl font-semibold leading-none">Settings</h1>
      <Spacer y={16} />
      <p className="text-lg font-medium">{session.user.email}</p>
      <Spacer y={12} />
      <ToggleBreakfastSwitch userId={session.sub} preferences={preferences} />
    </div>
  );
}
