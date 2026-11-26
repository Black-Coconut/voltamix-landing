import type { MetadataRoute } from "next";
import { LANGS } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const PAGES = ["", "/honenuki", "/volta-voice", "/agentic-daw", "/just-use", "/just-use/just-ds"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap((p) =>
    LANGS.map((lang) => ({
      url: `${SITE_URL}/${lang}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.8,
      alternates: { languages: Object.fromEntries(LANGS.map((l) => [l, `${SITE_URL}/${l}${p}`])) },
    })),
  );
}
