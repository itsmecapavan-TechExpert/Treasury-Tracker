import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // TEMPORARY BYPASS: Allow everyone to access everything
      return true;
    },
  },
  providers: [], // Empty for now
} satisfies NextAuthConfig;
