import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, isLang, pickLang, type Lang } from "@/lib/i18n";

/* Paths without a language ("/", "/honenuki", old links) → "/ko/…" or "/en/…":
   the visitor's saved choice first, else the browser language. Query strings (utm…) are kept. */

/* Link-preview crawlers (X, Facebook, Slack, KakaoTalk…) often don't follow redirects; they get the page itself. */
const PREVIEW_BOTS =
  /twitterbot|facebookexternalhit|facebot|meta-externalagent|slackbot|discordbot|linkedinbot|telegrambot|whatsapp|kakaotalk-scrap|pinterest|redditbot|skypeuripreview|embedly|iframely|vkshare|line-poker|applebot|bluesky|mastodon/i;

/* Short or old paths that should land somewhere else. */
const ALIASES: Record<string, string> = {
  "/just-ds": "/just-use/just-ds",
  "/justuse": "/just-use",
};

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLang(first)) return NextResponse.next();

  const rest = ALIASES[pathname] ?? (pathname === "/" ? "" : pathname);
  const ua = request.headers.get("user-agent") ?? "";
  const acceptLanguage = request.headers.get("accept-language");

  if (PREVIEW_BOTS.test(ua)) {
    const lang: Lang = /kakaotalk-scrap/i.test(ua) ? "ko" : pickLang(undefined, acceptLanguage);
    const res = NextResponse.rewrite(new URL(`/${lang}${rest}${search}`, request.url));
    res.headers.set("Vary", "User-Agent, Accept-Language");
    return res;
  }

  const lang = pickLang(request.cookies.get(LANG_COOKIE)?.value, acceptLanguage);
  const res = NextResponse.redirect(new URL(`/${lang}${rest}${search}`, request.url), 307);
  res.headers.set("Vary", "Accept-Language, Cookie, User-Agent");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // everything except the API, Next internals and files with an extension (icon.svg, robots.txt, sitemap.xml…)
  matcher: ["/((?!api/|_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};
