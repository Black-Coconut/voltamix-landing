import type { Metadata } from "next";
import Link from "next/link";
import VsBoard from "@/components/VsBoard";
import { justDs } from "@/lib/content/justUse";
import { href, langOf } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { LINKS, PRO_DS_PRICE } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params);
  return pageMeta(lang, "/just-use/just-ds", justDs[lang].metaTitle, justDs[lang].metaDesc);
}

export default async function JustDsPage({ params }: Props) {
  const lang = await langOf(params);
  const t = justDs[lang];
  const download = `${LINKS.justDs}/${lang}`; // deesser.voltamix.studio has /ko and /en

  return (
    <div data-p="justUse">
      <section className="vs-hero">
        <div className="wrap">
          <p className="tag">
            <Link href={href(lang, "/just-use")}>Just Use</Link>
            <span>Just-DS</span>
          </p>
          <h1 className="vs-title">{t.title}</h1>

          <div className="vs-face" aria-label={t.faceAria}>
            <div className="vs-side vs-them">
              <p className="mono">FabFilter</p>
              <p className="vs-name">Pro-DS</p>
              <p className="vs-price">${PRO_DS_PRICE}</p>
              <p className="vs-sub">{t.themSub}</p>
            </div>
            <div className="vs-mid" aria-hidden="true">
              VS
            </div>
            <div className="vs-side vs-us">
              <p className="mono">Voltamix Just Use</p>
              <p className="vs-name">Just-DS</p>
              <p className="vs-price">$0</p>
              <p className="vs-sub">{t.usSub}</p>
            </div>
          </div>

          <div className="hero-ctas vs-ctas">
            <a className="btn btn-primary" href={download} rel="noopener">
              {t.ctaDownload}
            </a>
            <a className="btn btn-ghost" href="#rounds">
              {t.ctaCompare}
            </a>
          </div>
          <p className="tag vs-meta">
            <span>Windows VST3</span>
            <span>macOS VST3 / AU</span>
          </p>
        </div>
      </section>

      <section id="rounds" className="sec">
        <div className="wrap">
          <h2 className="h2">{t.rounds.title}</h2>
          <VsBoard rows={t.rows} t={t.board} />
          <p className="footnote">{t.footnote}</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.extra.title}</h2>
          <ul className="cards3">
            {t.extra.items.map((e, i) => (
              <li key={e.k}>
                {i > 0 && (
                  <p className="card-k">
                    <span className="badge badge-free">{t.extra.badge}</span>
                  </p>
                )}
                <h3>{e.t}</h3>
                <p>{e.d}</p>
                <p className="mono card-spec">{e.spec}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec final">
        <div className="wrap">
          <h2 className="h2">{t.final.title}</h2>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={download} rel="noopener">
              {t.final.cta}
            </a>
            <Link className="btn btn-ghost" href={href(lang, "/just-use#request")}>
              {t.final.other}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
