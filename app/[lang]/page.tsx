import type { Metadata } from "next";
import Link from "next/link";
import Mineral from "@/components/Mineral";
import DeterminismDemo from "@/components/DeterminismDemo";
import { common, productsFor } from "@/lib/content/common";
import { home } from "@/lib/content/home";
import { href, langOf } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { rich } from "@/lib/rich";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params);
  const s = common[lang].site;
  const m = pageMeta(lang, "/", s.title, s.description, s.ogTitle);
  return { ...m, title: { absolute: s.title } };
}

export default async function Home({ params }: Props) {
  const lang = await langOf(params);
  const t = home[lang];
  const c = common[lang];

  return (
    <>
      {/* The crystal fills the screen; the headline is set straight over it and inverts where it crosses the light. */}
      <section className="hh" data-mineral-host>
        <Mineral kind="resonator" className="hh-stone" label={t.stage} />
        <p className="hh-side mono" aria-hidden="true">
          Voltamix · Music Tech · BlackCoconut
        </p>
        <h1 className="hh-title">
          <span className="hh-l1">{c.catch.l1}</span>
          <span className="hh-l2">{c.catch.l2}</span>
        </h1>
        <div className="hh-foot enter">
          <div className="hh-copy">
            <p className="hh-lede">{t.lede}</p>
            <div className="hero-ctas">
              <Link href="#products" className="btn btn-primary">
                {t.ctaProducts}
              </Link>
              <Link href={href(lang, "/just-use/just-ds")} className="btn btn-ghost">
                {t.ctaJustDs}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="manifesto" className="mf">
        <div className="wrap">
          <h2 className="mega">{rich(t.manifesto.title)}</h2>
          <p className="lede mf-lede">{rich(t.manifesto.lede)}</p>
        </div>

        <ol className="wrap cascade">
          {t.manifesto.tenets.map((x, i) => (
            <li key={x.t}>
              <span className="cascade-no" aria-hidden="true">
                0{i + 1}
              </span>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </li>
          ))}
        </ol>

        <div className="wrap mf-demo">
          <p className="mf-demo-t">{t.manifesto.demoTitle}</p>
          <DeterminismDemo t={t.demo} />
        </div>

        <blockquote className="wrap mf-pull" lang={lang}>
          {rich(t.manifesto.pull)}
        </blockquote>
      </section>

      {/* Four specimens on a zig-zag. The field behind takes each one's colour as it passes the middle of the screen. */}
      <section id="products" className="lu">
        <div className="wrap">
          <h2 className="mega lu-title">{t.lineup.title}</h2>
        </div>
        <ul className="lu-list">
          {productsFor(lang).map((p) => (
            <li key={p.key} data-p={p.key} data-tint className="lu-item">
              <Link href={href(lang, p.path)} className="lu-link" data-mineral-host>
                <Mineral kind={p.mineral} className="lu-stone" />
                <span className="lu-no" aria-hidden="true">
                  {p.no}
                </span>
                <div className="lu-text">
                  <p className="tag">
                    {p.status ? <span className="tag-status">{p.status.label}</span> : <span>{p.kind}</span>}
                  </p>
                  <h3 className="lu-name">{p.name}</h3>
                  <p className="lu-line">{p.line}</p>
                  <p className="lu-body">{p.body}</p>
                  <span className="lu-go" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="sun" data-p="justUse" data-tint>
        <div className="wrap">
          <h2 className="sun-q">{t.band.q}</h2>
          <div className="sun-a">
            <p>{t.band.a}</p>
            <Link href={href(lang, "/just-use")} className="btn btn-primary">
              {t.band.cta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
