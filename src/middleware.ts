import { boolean } from "fp-ts";
import { pipe } from "fp-ts/function";
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import createIntlMiddleware from "next-intl/middleware";
import type { NextFetchEvent } from "next/server";
import { LOCALES } from "./i18n";

const PUBLIC_ROUTES = ["/", "/signin"];

const intlMiddlware = createIntlMiddleware({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
});

const authMiddleware = withAuth(req => intlMiddlware(req));

const middleware = (req: NextRequestWithAuth, event: NextFetchEvent) => {
  const publicPathnameRegex = RegExp(
    `^(/(${LOCALES.join("|")}))?(${PUBLIC_ROUTES.flatMap(p =>
      p === "/" ? ["", "/"] : p,
    ).join("|")})/?$`,
    "i",
  );

  return pipe(
    publicPathnameRegex.test(req.nextUrl.pathname),
    boolean.fold(
      () => authMiddleware(req, event),
      () => intlMiddlware(req),
    ),
  );
};

export default middleware;

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
