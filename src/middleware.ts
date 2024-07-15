export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/inventory/:path*",
    "/projects/:path*",
    "/requests/:path*",
    "/admin/:path*",
    "/files/:path*",
    "/profile/:path*",
  ],
};