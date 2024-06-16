import { match } from "ts-pattern";
import type { MealType } from "./types";

export const getPlaceHolderImageByType = (type: MealType): string =>
  match(type)
    .with("breakfast", () => "/breakfast.jpeg")
    .with("lunch", () => "/lunch.jpeg")
    .with("diner", () => "/diner.jpeg")
    .exhaustive();
