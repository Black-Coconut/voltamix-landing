"use client";

import type { MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, LANGS, swapLang, type Lang } from "@/lib/i18n";

const NAMES: Record<Lang, string> = { ko: "한국어", en: "English" };

/** Remember an explicit choice so "/" sends this visitor to the same language next time. */
function remember(lang: Lang) {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`;
}

/** KO | EN toggle. Stays on the same page and keeps the #section. Plain links without JS. */
export default function LangSwitch({ current, aria }: { current: Lang; aria: string }) {
  const pathname = usePathname() || `/${current}`;

  function go(e: MouseEvent<HTMLAnchorElement>, lang: Lang) {
    remember(lang);
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (lang !== current) window.location.assign(swapLang(pathname, lang) + window.location.hash);
  }

  return (
    <div className="lang-toggle" role="group" aria-label={aria}>
      {LANGS.map((lang) => (
        <a
          key={lang}
          href={swapLang(pathname, lang)}
          hrefLang={lang}
          lang={lang}
          title={NAMES[lang]}
          aria-current={lang === current ? "page" : undefined}
          onClick={(e) => go(e, lang)}
        >
          {lang.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
