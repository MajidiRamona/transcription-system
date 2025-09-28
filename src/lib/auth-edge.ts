import { NextAuthConfig } from "next-auth"
import { UserRole } from "@/generated/prisma"

export const authConfigEdge: NextAuthConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
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
    session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as UserRole
        session.user.id = token.sub!
      }
      return session
    },
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role
      }
      return token
    },
  },
  providers: [], // Empty for edge runtime - auth providers will be configured in the main auth
}