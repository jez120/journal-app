import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import prisma from "@/lib/db";

// Extend session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email.toLowerCase() },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isValid = await compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        signOut: "/",
        error: "/login",
        newUser: "/onboarding",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// Helper to hash password (used during signup)
export async function hashPassword(password: string): Promise<string> {
    return hash(password, 12);
}
