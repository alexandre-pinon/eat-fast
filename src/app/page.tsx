import { auth } from "@/auth";
import { NavBar } from "@/components/navbar";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();

  if (session?.sub) {
    redirect("/meals-of-the-week");
  }

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main className="container mx-auto mt-24">
        <div className="max-w-lg space-y-10">
          <h1 className="text-4xl font-semibold leading-none">
            Meal planning made easy
          </h1>
          <p className="text-lg font-medium">
            Simplify your weekly meals with just a few taps
          </p>
        </div>
      </main>
    </>
  );
}
