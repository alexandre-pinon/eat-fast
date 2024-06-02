import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { accounts, db, sessions, users, verificationTokens } from "./db/schema";

const providers = [
  Google,
  Resend({
    from: "eat-fast@resend.dev",
  }),
] satisfies Provider[];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider({});
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers,
  pages: {
    signIn: "/signin",
  },
  theme: {
    colorScheme: "light",
    logo: "/logo.svg",
    brandColor: "#DA1C52",
  },
});
