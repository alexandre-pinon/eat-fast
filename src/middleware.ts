import { boolean } from "fp-ts";
import { pipe } from "fp-ts/function";
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import type { NextFetchEvent } from "next/server";
import { routing } from "./i18n/routing";

const PUBLIC_ROUTES = ["/", "/signin"];

const intlMiddlware = createMiddleware(routing);

const authMiddleware = withAuth(req => intlMiddlware(req));

const middleware = (req: NextRequestWithAuth, event: NextFetchEvent) => {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${PUBLIC_ROUTES.flatMap(p =>
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
