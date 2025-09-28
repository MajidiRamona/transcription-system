import { auth } from "./src/auth"
import { NextRequest } from "next/server"

export default auth((req: NextRequest & { auth?: any }) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/auth/signin', req.url))
  }
})