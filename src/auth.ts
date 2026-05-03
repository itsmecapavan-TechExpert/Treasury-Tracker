import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // AUTO-SETUP: If no user exists at all, create the first one as admin
        const userCount = await prisma.user.count();
        if (!user && userCount === 0) {
          const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
          user = await prisma.user.create({
            data: {
              email: credentials.email as string,
              name: "Admin",
              password: hashedPassword,
              role: "ADMIN",
            },
          });
          return user;
        }

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (passwordsMatch) return user;

        return null;
      },
    }),
  ],
});
