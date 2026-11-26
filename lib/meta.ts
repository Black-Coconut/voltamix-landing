import type { Metadata } from "next";
import type { Lang } from "./i18n";
import { SITE_NAME } from "./site";

/** Per-page metadata with canonical + hreflang alternates. `path` is the page path without the language ("/just-use"). */
export function pageMeta(lang: Lang, path: string, title: string, description: string, ogTitle?: string): Metadata {
  const p = path === "/" ? "" : path;
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}${p}`,
      languages: { ko: `/ko${p}`, en: `/en${p}`, "x-default": p || "/" },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: lang === "ko" ? "en_US" : "ko_KR",
      url: `/${lang}${p}`,
      title: ogTitle ?? title,
      description,
    },
    twitter: { card: "summary_large_image", title: ogTitle ?? title, description },
  };
}
