import { db } from "@/db/client";
import { meals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const userMeals = await db
    .select({
      id: meals.id,
      name: meals.name,
      type: meals.type,
      weekDay: meals.weekDay,
      time: meals.time,
      image: meals.image,
    })
    .from(meals)
    .where(eq(meals.userId, token.sub));

  return NextResponse.json(userMeals);
};
