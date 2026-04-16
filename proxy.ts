import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "cs"];
const defaultLocale = "en"; // Default to English for international users
const localeCookieName = "locale";

function getLocaleFromCookie(request: NextRequest): string | undefined {
  const cookie = request.cookies.get(localeCookieName)?.value;
  if (cookie && locales.includes(cookie)) {
    return cookie;
  }
  return undefined;
}

function getLocaleFromAcceptLanguage(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch {
    return undefined;
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Generate Nonce and CSP
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const reportUri = "/api/csp-report";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${
    isDev ? " 'unsafe-eval'" : ""
  };
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    report-uri ${reportUri};
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // 2. Prepare Headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // 3. Handle Locale Redirection
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    let locale = getLocaleFromCookie(request);
    if (!locale) {
      locale = getLocaleFromAcceptLanguage(request);
    }
    if (!locale) {
      locale = defaultLocale;
    }

    const redirectResponse = NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url),
      {
        headers: {
          "Content-Security-Policy": cspHeader,
        },
      }
    );
    return redirectResponse;
  }

  // 4. Return Next Response with CSP and Nonce
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
