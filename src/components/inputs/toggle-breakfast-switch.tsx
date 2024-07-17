"use client";

import { toggleDisplayBreakfastAction } from "@/actions/toggle-display-breakfast.action";
import type { UserPreferences } from "@/entities/user";
import { Switch } from "@nextui-org/react";

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

  return (
    <div className="flex items-center justify-between max-w-xs w-full">
      <span>Display breakfast</span>
      <Switch
        defaultSelected={preferences.displayBreakfast}
        onValueChange={onSwitchValueChange}
      />
    </div>
  );
};
