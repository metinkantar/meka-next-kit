import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "db";
import authConfig from "@/lib/auth/auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 day
        updateAge: 60 * 60, // 1 hour
    },
    ...authConfig,
});