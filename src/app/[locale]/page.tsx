import { auth } from "@/auth";
import { NavBar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import type { LocaleParams } from "@/types";
import { unstable_setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

const HomePage = async ({ params }: LocaleParams) => {
  unstable_setRequestLocale(params.locale);

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
        <HeroSection />
      </main>
    </>
  );
};

export default HomePage;
