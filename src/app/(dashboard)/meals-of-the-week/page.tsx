import { randomUUID } from "node:crypto";
import { getUserIdFromServerSession } from "@/auth";
import { MealsOfTheWeek } from "@/components/meals-of-the-week";
import { db } from "@/db/client";
import { mealType, meals, weekDay } from "@/db/schema";
import {
  type Meal,
  type WeekMeal,
  type WeekMealData,
  parseMeal,
} from "@/entities/meal";
import type { TechnicalError } from "@/errors/technial.error";
import { logError } from "@/logger";
import { toPromise, tryCatchTechnical } from "@/utils";
import { ScrollShadow, Spacer } from "@nextui-org/react";
import { eq } from "drizzle-orm";
import { array, option, readonlyArray, record, taskEither } from "fp-ts";
import { pipe } from "fp-ts/function";
import type { TaskEither } from "fp-ts/lib/TaskEither";
import { redirect } from "next/navigation";

const getMealsByUserId = (
  userId: string,
): TaskEither<TechnicalError, Meal[]> => {
  return pipe(
    tryCatchTechnical(
      () => db.select().from(meals).where(eq(meals.userId, userId)),
      "Error while finding meals by user id",
    ),
    taskEither.flatMap(taskEither.traverseArray(parseMeal)),
    taskEither.map(readonlyArray.toArray),
  );
};

const generateMissingMealsByDay = (userMealsByDay: Meal[]): WeekMeal[] => {
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
        })),
      ),
    ),
  );
};

const groupMealsByWeekDay = (userMeals: Meal[]): WeekMealData =>
  pipe(
    weekDay.enumValues,
    array.reduce({} as WeekMealData, (acc, curr) =>
      pipe(
        userMeals,
        array.filter(meal => meal.weekDay === curr),
        generateMissingMealsByDay,
        mealsByDay =>
          pipe(
            acc,
            record.upsertAt(curr, mealsByDay),
            meals => meals as WeekMealData,
          ),
      ),
    ),
  );

const getWeekMeals = (): Promise<WeekMealData> => {
  return pipe(
    getUserIdFromServerSession(),
    taskEither.flatMap(getMealsByUserId),
    taskEither.map(groupMealsByWeekDay),
    taskEither.orElseFirstIOK(logError),
    toPromise,
  );
};

export default async function MealsOfTheWeekPage() {
  try {
    const data = await getWeekMeals();
    return (
      <div>
        <h1 className="text-4xl font-semibold leading-none">
          Meals of the week
        </h1>
        <Spacer y={16} />
        <ScrollShadow
          hideScrollBar
          className="flex gap-x-4 flex-nowrap overflow-x-scroll"
        >
          <MealsOfTheWeek data={data} />
        </ScrollShadow>
      </div>
    );
  } catch {
    redirect("/");
  }
}
