import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["(.*)/dashboard(.*)"]);
const isGuestAllowedRoute = createRouteMatcher(["/chatbot(.*)", "/dashboard(.*)", "/$"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  // If user is signed in, allow all
  if (userId) return;

  // If guest, only allow /chatbot, /dashboard, and homepage
  if (!isGuestAllowedRoute(req)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.set("guest", "1");
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
