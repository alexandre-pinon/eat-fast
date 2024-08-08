import { auth } from "@/auth";
import { NavBar } from "@/components/navbar";
import { CtaSection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { PricingSection } from "@/components/sections/pricing-section";
import type { LocaleParams } from "@/types";
import { Spacer } from "@nextui-org/react";
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
      <main className="container mx-auto">
        <Spacer y={24} />
        <HeroSection />
        <Spacer y={40} />
        <FeaturesSection />
        <Spacer y={40} />
        <PricingSection />
        <Spacer y={40} />
        <CtaSection />
        <Spacer y={40} />
      </main>
    </>
  );
};

export default HomePage;
