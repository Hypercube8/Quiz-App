import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { loginSchema } from "@/lib/login";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/signin"
    },
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnJoin = nextUrl.pathname.startsWith("/join");
            
            if (isOnJoin && !isLoggedIn) {
                return Response.redirect(new URL("/signin", nextUrl));
            } 

            return true;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = loginSchema.safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({
                        where: { email }
                    })

                    if (!user) { return null; }
                    
                    const passwordsMatch = await bcrypt.compare(password, user.password ?? "");
                    if (passwordsMatch) {
                        return user;
                    }
                }
                return null;
            }
        }),
        GitHub
    ],
    cookies: {
        sessionToken: {
            name: "authjs.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
})