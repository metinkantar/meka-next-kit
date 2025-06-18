import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { auth } from "auth";
import { routing } from "./i18n/routing";

const locales = ["krd", "fr", "de", "en", "tr", "nl"];
const authPages = ["/login", "/register", "/verify-email"];
const publicPages = [
  "/",
  "/login",
  "/register",
  "/about",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

const intlMiddleware = createIntlMiddleware(routing);
const testPathnameRegex = (pages: string[], pathName: string): boolean => {
  return RegExp(
    `^(/(${locales.join("|")}))?(${pages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  ).test(pathName);
};

const authMiddleware = auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isAuthPage = testPathnameRegex(authPages, pathname);
  const session = req.auth;

  const locale = pathname.split("/")[1] ?? "en";

  /* // Slash'lara göre böl
  const parts = pathname.split("/");
  let locale = null;
  // İkinci kısım dil bilgisini içerir (örneğin, "tr")
  if (parts.length > 1 && parts[1].length >= 2 && parts[1].length <= 3) {
    locale = parts[1];
  } else {
    locale = "en"; // Varsayılan dil
  } */

  if (pathname.startsWith(`/${locale}/panel`)) {
    if (!session || session.user?.role !== "Admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  // Redirect to sign-in page if not authenticated
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to home page if authenticated and trying to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return intlMiddleware(req);
});

const middleware = (req: NextRequest) => {
  const isPublicPage = testPathnameRegex(publicPages, req.nextUrl.pathname);
  const isAuthPage = testPathnameRegex(authPages, req.nextUrl.pathname);

  if (isAuthPage) {
    return (authMiddleware as any)(req);
  }

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
};

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

export default middleware;
