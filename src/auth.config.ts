
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: '/auth/login',
    },
    callbacks: {
        // This authorized callback runs in middleware
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isAdminRoute = nextUrl.pathname.startsWith("/admin");

            if (isAdminRoute) {
                if (isLoggedIn) {
                    // @ts-ignore
                    return auth.user.role === "admin";
                }
                return false; // Redirect to login
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user && token.role) {
                // @ts-ignore
                session.user.role = token.role;
                // @ts-ignore
                session.user.id = token.id;
            }
            return session;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
