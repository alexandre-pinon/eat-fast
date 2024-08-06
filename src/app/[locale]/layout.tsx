import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";
import { LOCALES } from "@/i18n";
import type { LocaleParams } from "@/types";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClientProviders } from "../client-providers";

const font = Poppins({
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eat-fast",
  description: "Meal planning made easy",
};

export const generateStaticParams = () => {
  return LOCALES.map(locale => ({ locale }));
};

const RootLayout = async ({
  children,
  params,
}: Readonly<LocaleParams & { children: ReactNode }>) => {
  const messages = await getMessages();

  return (
    <html lang={params.locale} className="light">
      <body className={font.className}>
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>{children}</ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
