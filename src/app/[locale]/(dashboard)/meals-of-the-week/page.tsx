import { randomUUID } from "node:crypto";
import { getUserIdFromServerSession } from "@/auth";
import { MealsOfTheWeek } from "@/components/meals-of-the-week";
import { db } from "@/db/client";
import { mealType, meals, weekDay } from "@/db/schema";
import {
  type Meal,
  type WeekMeal,
  type WeekMealData,
  parseMealAsync,
} from "@/entities/meal";
import type { UserPreferences } from "@/entities/user";
import type { TechnicalError } from "@/errors/technial.error";
import { logError } from "@/logger";
import { getPreferencesByUserId } from "@/repositories/user-repository";
import type { WeekDay } from "@/types/weekday";
import { toPromise, tryCatchTechnical } from "@/utils";
import { ScrollShadow, Spacer } from "@nextui-org/react";
import { and, eq } from "drizzle-orm";
import { array, option, readonlyArray, record, taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { useTranslations } from "next-intl";
import { redirect } from "next/navigation";

const getMealsByUserId = (
  userId: string,
): TaskEither<TechnicalError, Meal[]> => {
  return pipe(
    tryCatchTechnical(
      () =>
        db
          .select()
          .from(meals)
          .where(and(eq(meals.userId, userId), eq(meals.archived, false))),
      `Error while finding meals for user #${userId}`,
    ),
    taskEither.flatMap(taskEither.traverseArray(parseMealAsync)),
    taskEither.map(readonlyArray.toArray),
  );
};

const generateMissingMealsByDay =
  (weekDay: WeekDay) =>
  (userMealsByDay: Meal[]): WeekMeal[] => {
    return pipe(
      mealType.enumValues,
      array.map(type =>
        pipe(
          userMealsByDay,
          array.findFirst(meal => meal.type === type),
          option.map(meal => ({ ...meal, empty: false })),
          option.getOrElse<WeekMeal>(() => ({
            id: randomUUID(),
            empty: true,
            type,
            weekDay,
            isLeftover: false,
            servings: 1,
          })),
        ),
      ),
    );
  };

const groupMealsByWeekDay = (userMeals: Meal[]): WeekMealData =>
  pipe(
    weekDay.enumValues,
    array.reduce({} as WeekMealData, (accWeekDay, currWeekDay) =>
      pipe(
        userMeals,
        array.filter(meal => meal.weekDay === currWeekDay),
        generateMissingMealsByDay(currWeekDay),
        mealsByDay =>
          pipe(
            accWeekDay,
            record.upsertAt(currWeekDay, mealsByDay),
            meals => meals as WeekMealData,
          ),
      ),
    ),
  );

const getWeekMeals: (
  userId: string,
) => TaskEither<TechnicalError, WeekMealData> = flow(
  getMealsByUserId,
  taskEither.map(groupMealsByWeekDay),
);

const getUserData = (): Promise<{
  data: WeekMealData;
  preferences: UserPreferences;
}> => {
  return pipe(
    getUserIdFromServerSession(),
    taskEither.flatMap(userId =>
      pipe(
        taskEither.Do,
        taskEither.apS("data", getWeekMeals(userId)),
        taskEither.apS("preferences", getPreferencesByUserId(userId)),
      ),
    ),
    taskEither.orElseFirstIOK(logError),
    toPromise,
  );
};

const MealsOfTheWeekPage = async () => {
  try {
    const { data, preferences } = await getUserData();

    return (
      <div>
        <Heading />
        <Spacer y={16} />
        <ScrollShadow
          hideScrollBar
          className="flex gap-x-4 flex-nowrap overflow-x-scroll"
        >
          <MealsOfTheWeek data={data} preferences={preferences} />
        </ScrollShadow>
      </div>
    );
  } catch {
    redirect("/signin");
  }
};

const Heading = () => {
  const t = useTranslations("MealsOfTheWeekPage");

  return (
    <h1 className="text-4xl font-semibold leading-none">{t("heading")}</h1>
  );
};

export default MealsOfTheWeekPage;
