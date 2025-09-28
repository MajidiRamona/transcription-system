import { auth } from "./src/auth"

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/auth/signin', req.url))
  }
})