"use client";

import { toggleDisplayBreakfastAction } from "@/actions/toggle-display-breakfast.action";
import type { UserPreferences } from "@/entities/user";
import { Switch } from "@nextui-org/react";
import { useTranslations } from "next-intl";

type ToggleBreakfastSwitchProps = {
  userId: string;
  preferences: UserPreferences;
};
export const ToggleBreakfastSwitch = ({
  userId,
  preferences,
}: ToggleBreakfastSwitchProps) => {
  const onSwitchValueChange = async (displayBreakfast: boolean) => {
    await toggleDisplayBreakfastAction(userId, displayBreakfast);
  };

  const t = useTranslations("SettingsPage");

  return (
    <div className="flex items-center justify-between max-w-xs w-full">
      <span className="pl-2.5">{t("displayBreakfast")}</span>
      <Switch
        classNames={{
          wrapper: "mr-0",
        }}
        defaultSelected={preferences.displayBreakfast}
        onValueChange={onSwitchValueChange}
      />
    </div>
  );
};
