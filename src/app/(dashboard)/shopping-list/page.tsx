import { getUserIdFromServerSession } from "@/auth";
import { IngredientItem } from "@/components/ingredient-item";
import { db } from "@/db/client";
import { ingredients, meals, mealsToIngredients } from "@/db/schema";
import {
  type AggregatedMealIngredient,
  type MealIngredient,
  parseAggregatedMealIngredientAsync,
} from "@/entities/ingredient";
import type { WeekMealIngredient } from "@/entities/meal";
import type { TechnicalError } from "@/errors/technial.error";
import type { ValidationError } from "@/errors/validation.error";
import { getPreferencesByUserId } from "@/repositories/user-repository";
import type { QuantityUnit } from "@/types/quantity-unit";
import { type WeekDay, weekDays } from "@/types/weekday";
import { toPromise, tryCatchTechnical } from "@/utils";
import { Card, CardBody, Spacer } from "@nextui-org/react";
import { and, eq, ne, sum } from "drizzle-orm";
import {
  array,
  nonEmptyArray,
  number,
  ord,
  readonlyArray,
  record,
  string,
  taskEither,
} from "fp-ts";
import type { NonEmptyArray } from "fp-ts/NonEmptyArray";
import type { Semigroup } from "fp-ts/Semigroup";
import type { TaskEither } from "fp-ts/TaskEither";
import { flow, pipe } from "fp-ts/function";
import { redirect } from "next/navigation";

const getAllMealIngredientsWithAggregatedQuantity = (
  userId: string,
): TaskEither<
  TechnicalError | ValidationError,
  readonly AggregatedMealIngredient[]
> => {
  return pipe(
    getPreferencesByUserId(userId),
    taskEither.flatMap(preferences =>
      tryCatchTechnical(
        () =>
          db
            .select({
              id: ingredients.id,
              userId: ingredients.userId,
              name: ingredients.name,
              unit: mealsToIngredients.unit,
              quantity: sum(mealsToIngredients.quantityWithServings),
              weekDay: meals.weekDay,
            })
            .from(mealsToIngredients)
            .innerJoin(
              ingredients,
              eq(ingredients.id, mealsToIngredients.ingredientId),
            )
            .innerJoin(meals, eq(meals.id, mealsToIngredients.mealId))
            .where(
              and(
                eq(ingredients.userId, userId),
                eq(meals.archived, false),
                eq(meals.isLeftover, false),
                ...(preferences.displayBreakfast
                  ? []
                  : [ne(meals.type, "breakfast")]),
              ),
            )
            .groupBy(ingredients.id, mealsToIngredients.unit, meals.weekDay),
        "Error while finding all meal ingredients with aggregated quantity",
      ),
    ),
    taskEither.flatMap(
      taskEither.traverseArray(parseAggregatedMealIngredientAsync),
    ),
  );
};

const groupIngredients = (
  ingredients: readonly AggregatedMealIngredient[],
): WeekMealIngredient => {
  const groupByNameAndUnit: Semigroup<{
    id: string;
    userId: string;
    quantity: number;
    weekDays: NonEmptyArray<WeekDay>;
  }> = {
    concat: (x, y) => ({
      id: x.id,
      userId: x.userId,
      quantity: x.quantity + y.quantity,
      weekDays: nonEmptyArray.concat(x.weekDays)(y.weekDays),
    }),
  };
  const weekMealIngredientMonoid = record.getMonoid<WeekDay, MealIngredient[]>(
    array.getMonoid(),
  );

  const byWeekDay = pipe(
    number.Ord,
    ord.contramap((day: WeekDay) => weekDays.indexOf(day)),
  );
  const mealIngredientByWeekDay = pipe(
    number.Ord,
    ord.contramap((ingredient: MealIngredient & { weekDay: WeekDay }) =>
      weekDays.indexOf(ingredient.weekDay),
    ),
  );

  const getEarliestDay = flow(
    nonEmptyArray.sort(byWeekDay),
    nonEmptyArray.head,
  );

  return pipe(
    ingredients,
    readonlyArray.foldMap(record.getMonoid(groupByNameAndUnit))(ingredient => ({
      [`${ingredient.name}-${ingredient.unit ?? ""}`]: {
        id: ingredient.id,
        userId: ingredient.userId,
        quantity: ingredient.quantity,
        weekDays: [ingredient.weekDay],
      },
    })),
    record.collect(string.Ord)((key, { weekDays, id, userId, quantity }) => {
      const [name, unit] = key.split("-");
      return {
        weekDay: getEarliestDay(weekDays),
        name,
        unit: (unit.length > 0 ? unit : null) as QuantityUnit,
        id,
        userId,
        quantity,
      };
    }),
    array.sortBy([mealIngredientByWeekDay]),
    array.foldMap(weekMealIngredientMonoid)(
      ({ weekDay, ...ingredient }) =>
        ({ [weekDay]: [ingredient] }) as WeekMealIngredient,
    ),
  );
};

const getWeekMealIngredients = (): Promise<WeekMealIngredient> => {
  return pipe(
    getUserIdFromServerSession(),
    taskEither.flatMap(getAllMealIngredientsWithAggregatedQuantity),
    taskEither.map(groupIngredients),
    toPromise,
  );
};

export default async function ShoppingListPage() {
  try {
    const weekMealIngredients = await getWeekMealIngredients();

    return (
      <div>
        <h1 className="text-4xl font-semibold leading-none">Shopping list</h1>
        <Spacer y={16} />
        <div className="space-y-2">
          {Object.entries(weekMealIngredients).map(([day, ingredients]) => (
            <ShoppingCard
              key={day}
              day={day as WeekDay}
              ingredients={ingredients}
            />
          ))}
        </div>
      </div>
    );
  } catch {
    redirect("/signin");
  }
}

const ShoppingCard = ({
  ingredients,
  day,
}: { ingredients: MealIngredient[]; day: WeekDay }) => {
  return (
    <Card
      shadow="none"
      className="relative bg-primary-100 odd:bg-opacity-50 py-3"
    >
      <span className="absolute top-2 right-4 italic text-lg font-medium capitalize">
        {day}
      </span>
      <CardBody>
        <div className="flex flex-col gap-y-3">
          {ingredients.map(ingredient => (
            <IngredientItem
              key={ingredient.id}
              ingredient={ingredient}
              servings={1}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
