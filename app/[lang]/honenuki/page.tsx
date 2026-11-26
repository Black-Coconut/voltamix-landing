import type { Metadata } from "next";
import ProductHero from "@/components/ProductHero";
import { common } from "@/lib/content/common";
import { honenuki } from "@/lib/content/products";
import { langOf } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { rich } from "@/lib/rich";
import { LINKS } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params);
  return pageMeta(lang, "/honenuki", honenuki[lang].metaTitle, honenuki[lang].metaDesc);
}

export default async function HonenukiPage({ params }: Props) {
  const lang = await langOf(params);
  const t = honenuki[lang];
  // honenuki.com serves Korean at "/" and English at "/en"
  const get = LINKS.honenuki ? (lang === "en" ? `${LINKS.honenuki}/en` : LINKS.honenuki) : "";

  return (
    <div data-p="honenuki">
      <ProductHero
        mineral="quartz"
        mark="Honenuki"
        tag={
          <>
            <span>VST3 / AU / Standalone</span>
          </>
        }
        title={t.title}
        lede={t.lede}
        ctas={
          <>
            {get && (
              <a className="btn btn-primary" href={get} rel="noopener">
                {t.ctaGet}
              </a>
            )}
            <a className="btn btn-ghost" href="#flow">
              {t.ctaHow}
            </a>
          </>
        }
      />

      <section id="flow" className="sec">
        <div className="wrap">
          <h2 className="h2">{t.flow.title}</h2>
          <ol className="flow">
            {t.flow.steps.map((s, i) => (
              <li key={s.k} className={i === 1 ? "flow-us" : undefined}>
                <span className="mono">{s.k}</span>
                <p className="flow-t">{s.t}</p>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.noises.title}</h2>
          <ul className="cards3">
            {t.noises.items.map((n) => (
              <li key={n.k}>
                <h3>{n.t}</h3>
                <p>{n.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec">
        <div className="wrap split">
          <div>
            <h2 className="h2">{t.control.title}</h2>
            <p className="lede">{t.control.lede}</p>
            <p className="proof">{t.control.proof}</p>
          </div>
          <dl className="ctrl-list">
            {t.control.items.map((c) => (
              <div key={c.k}>
                <dt>{c.k}</dt>
                <dd>{c.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {get && (
        <section className="sec final">
          <div className="wrap">
            <h2 className="h2">{t.final.title}</h2>
            <a className="btn btn-primary" href={get} rel="noopener">
              {t.final.cta}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
