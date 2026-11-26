import type { Metadata } from "next";
import ProductHero from "@/components/ProductHero";
import { common } from "@/lib/content/common";
import { voltaVoice } from "@/lib/content/products";
import { langOf } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { LINKS, REQUEST_EMAIL } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params);
  return pageMeta(lang, "/volta-voice", voltaVoice[lang].metaTitle, voltaVoice[lang].metaDesc);
}

export default async function VoltaVoicePage({ params }: Props) {
  const lang = await langOf(params);
  const t = voltaVoice[lang];

  return (
    <div data-p="voltaVoice">
      <ProductHero
        mineral="fluorite"
        mark="Volta Voice"
        tag={
          <>
            <span>{common[lang].products.voltaVoice.kind}</span>
          </>
        }
        title={t.title}
        lede={t.lede}
        ctas={
          LINKS.voltaVoice ? (
              <a className="btn btn-primary" href={LINKS.voltaVoice} rel="noopener">
                {t.ctaSee}
              </a>
            ) : (
              <a className="btn btn-primary" href={`mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(t.mailSubject)}`}>
                {t.ctaContact}
              </a>
            )
        }
      />

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.perf.title}</h2>
          <div className="keepchange">
            <div>
              <p className="mono kc-h">{t.perf.keepH}</p>
              <ul>
                {t.perf.keep.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div className="kc-change">
              <p className="mono kc-h">{t.perf.changeH}</p>
              <ul>
                {t.perf.change.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="lede">{t.perf.lede}</p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.uses.title}</h2>
          <ul className="cards3">
            {t.uses.items.map((u) => (
              <li key={u.t}>
                <h3>{u.t}</h3>
                <p>{u.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
