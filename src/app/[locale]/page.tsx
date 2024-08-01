import { auth } from "@/auth";
import { NavBar } from "@/components/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { redirect } from "next/navigation";

const HomePage = async () => {
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
