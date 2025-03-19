import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that can be accessed without authentication
const isPublicRoute = createRouteMatcher(["/sign-in", "/sign-up", "/", "/home"]);

// Define public API routes that can be accessed without authentication
const isPublicApiRoute = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  if (userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  if (!userId) {
    if (!isPublicRoute(req) && !isApiRequest) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
});


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
