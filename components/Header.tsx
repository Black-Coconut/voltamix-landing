import Link from "next/link";
import { common, productsFor } from "@/lib/content/common";
import { href, type Lang } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";
import { PARENT } from "@/lib/site";

export default function Header({ lang }: { lang: Lang }) {
  const t = common[lang];
  const products = productsFor(lang);
  return (
    <header className="hdr">
      <div className="wrap hdr-in">
        <div className="brand">
          <Link href={href(lang, "/")} className="brand-home" aria-label={t.homeAria}>
            <svg className="brand-mark" viewBox="0 0 16 18" aria-hidden="true">
              <path d="M8 0 15 4.5v9L8 18 1 13.5v-9Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M8 0 15 4.5 8 9 1 4.5Z" fill="currentColor" />
              <path d="M8 9v9l7-4.5v-9Z" fill="currentColor" fillOpacity="0.6" />
            </svg>
            <span className="brand-name">Voltamix</span>
          </Link>
          <a href={PARENT.url} rel="noopener" className="brand-by">
            by BlackCoconut
          </a>
        </div>

        <nav className="hdr-nav" aria-label={t.navAria}>
          {products.map((p) => (
            <Link key={p.key} href={href(lang, p.path)} className="hdr-link">
              {p.name}
            </Link>
          ))}
          <Link href={href(lang, "/#manifesto")} className="hdr-link hdr-muted">
            Manifesto
          </Link>
        </nav>

        <div className="hdr-right">
          <LangSwitch current={lang} aria={t.langAria} />
          <details className="hdr-menu">
            <summary aria-label={t.menuAria}>{t.menu}</summary>
            <div className="hdr-menu-panel">
              {products.map((p) => (
                <Link key={p.key} href={href(lang, p.path)}>
                  <span className="mono">{p.no}</span> {p.name}
                </Link>
              ))}
              <Link href={href(lang, "/#manifesto")}>Manifesto</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
