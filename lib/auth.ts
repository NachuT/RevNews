import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const email = credentials.email as string;
                const password = credentials.password as string;

                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (user && user.password) {
                    const isValid = await bcrypt.compare(password, user.password);
                    if (isValid) return user;
                    return null;
                } else if (!user) {
                    // Auto-register
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = await prisma.user.create({
                        data: {
                            email,
                            password: hashedPassword,
                            name: email.split("@")[0],
                        }
                    });
                    return newUser;
                }
                return null;
            }
        })
    ],
    callbacks: {
        session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }
            return session
        },
        jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        }
    }
})
