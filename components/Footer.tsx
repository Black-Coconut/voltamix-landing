import Link from "next/link";
import { common, productsFor } from "@/lib/content/common";
import { href, type Lang } from "@/lib/i18n";
import { PARENT } from "@/lib/site";

export default function Footer({ lang }: { lang: Lang }) {
  const t = common[lang];
  return (
    <footer className="ftr">
      <div className="wrap">
        <p className="motto">
          {t.catch.l1} {t.catch.l2}
        </p>
        <div className="ftr-grid">
          <div>
            <p className="ftr-brand">Voltamix</p>
            <p className="ftr-about">
              {t.footer.aboutBefore}
              <a href={PARENT.url} rel="noopener">
                {PARENT.name}
              </a>
              {t.footer.aboutAfter}
            </p>
          </div>
          <nav aria-label={t.footer.aria} className="ftr-nav">
            <p className="ftr-h">Products</p>
            {productsFor(lang).map((p) => (
              <Link key={p.key} href={href(lang, p.path)}>
                {p.name}
              </Link>
            ))}
          </nav>
          <nav aria-label={t.footer.companyAria} className="ftr-nav">
            <p className="ftr-h">Company</p>
            <Link href={href(lang, "/#manifesto")}>Manifesto</Link>
            <Link href={href(lang, "/just-use#request")}>{t.footer.request}</Link>
            <a href={PARENT.url} rel="noopener">
              blackcoconut.kr
            </a>
            <a href={lang === "ko" ? "/en" : "/ko"} hrefLang={lang === "ko" ? "en" : "ko"}>
              {lang === "ko" ? "English" : "한국어"}
            </a>
          </nav>
        </div>
        <p className="ftr-legal">
          © {new Date().getFullYear()} BlackCoconut. {t.footer.legal}
        </p>
      </div>
    </footer>
  );
}
