export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home/:path*",
    "/inventory/:path*",
    "/projects/:path*",
    "/requests/:path*",
    "/admin/:path*",
    "/files/:path*",
    "/profile/:path*",
    "/credits/:path*",
  ],
};
