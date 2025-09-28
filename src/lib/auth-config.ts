import Credentials from "next-auth/providers/credentials"
import { UserRole } from "@/generated/prisma"

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: any; request: { nextUrl: any } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')

      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
    session({ session, token }: { session: any; token: any }) {
      if (token.role) {
        session.user.role = token.role as UserRole
        session.user.id = token.sub!
      }
      return session
    },
    jwt({ token, user }: { token: any; user?: any }) {
      if (user?.role) {
        token.role = user.role
      }
      return token
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Import here to avoid Edge Runtime issues in middleware
        const { authenticateUser } = await import("./auth")

        const user = await authenticateUser(
          credentials.username as string,
          credentials.password as string
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          name: user.username,
          role: user.role,
        }
      },
    }),
  ],
}