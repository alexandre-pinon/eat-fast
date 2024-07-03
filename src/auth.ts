import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { option, taskEither } from "fp-ts";
import type { TaskEither } from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db/client";
import { accounts, sessions, users, verificationTokens } from "./db/schema";
import { TechnicalError } from "./errors/technial.error";
import { UnaunthenticatdError } from "./errors/unauthenticated.error";
import { logDebug } from "./logger";
import { tryCatchTechnical } from "./utils";

const config = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
    brandColor: "#DA1C52",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      return { ...session, sub: token.sub };
    },
  },
} satisfies NextAuthOptions;

export const handler = NextAuth(config);

export const auth = (
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) => {
  return getServerSession(...args, config);
};

export const getUserIdFromServerSession = (): TaskEither<
  UnaunthenticatdError,
  string
> => {
  return pipe(
    tryCatchTechnical(() => auth(), "Could not get server session"),
    taskEither.tapIO(logDebug),
    taskEither.map(session => option.fromNullable(session?.sub)),
    taskEither.flatMap(
      taskEither.fromOption(
        () => new TechnicalError("No user id found in session"),
      ),
    ),
    taskEither.mapError(error => new UnaunthenticatdError({ cause: error })),
  );
};
