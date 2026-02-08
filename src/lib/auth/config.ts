import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const authSecret =
  process.env.AUTH_SECRET ??
  (process.env.NODE_ENV !== "production" ? "dev-secret-change-me" : undefined);

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          console.warn("ورود نامعتبر: طرح Zod رد شد");
          return null;
        }
        const { email, password } = parsed.data;
        console.log("تلاش ورود:", email);
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });
        if (!admin) {
          console.warn("ورود نامعتبر: ایمیل یافت نشد");
          return null;
        }
        const isValid = await bcrypt.compare(password, admin.passwordHash);
        if (!isValid) {
          console.warn("ورود نامعتبر: رمز اشتباه");
          return null;
        }
        console.log("ورود موفق برای:", email);
        return {
          id: admin.id,
          email: admin.email,
          role: admin.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          ...(session.user ?? {}),
          id: token.sub,
          role: (token.role as string) ?? "ADMIN",
        } as typeof session.user & { id: string; role: string };
      }
      return session;
    },
  },
  secret: authSecret,
};
