import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { type SupportedLocales, routing } from "./routing";

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale as SupportedLocales)) {
    notFound();
  }

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
