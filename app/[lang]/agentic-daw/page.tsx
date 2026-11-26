import type { Metadata } from "next";
import RequestForm from "@/components/RequestForm";
import ProductHero from "@/components/ProductHero";
import { common } from "@/lib/content/common";
import { agenticDaw } from "@/lib/content/products";
import { langOf } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params);
  return pageMeta(lang, "/agentic-daw", agenticDaw[lang].metaTitle, agenticDaw[lang].metaDesc);
}

export default async function AgenticDawPage({ params }: Props) {
  const lang = await langOf(params);
  const t = agenticDaw[lang];
  const actions = [
    { track: "Lead Vox", param: "Fader", from: "−4.0 dB", to: "−2.5 dB", where: t.how.chorus },
    { track: "Lead Vox", param: "EQ · 3.2 kHz", from: "+2.0 dB", to: "+0.5 dB", where: t.how.chorus },
    { track: "Lead Vox", param: "De-ess · Threshold", from: "−18 dB", to: "−22 dB", where: t.how.whole },
    { track: "Synth Pad", param: "EQ · 2.5 kHz", from: "0 dB", to: "−1.5 dB", where: t.how.chorus },
  ];

  return (
    <div data-p="agenticDaw">
      <ProductHero
        mineral="pyrite"
        mark="Agentic DAW"
        tag={
          <>
            <span className="tag-status">{common[lang].products.agenticDaw.status?.label}</span>
          </>
        }
        title={t.title}
        lede={t.lede}
        ctas={
          <a className="btn btn-primary" href="#waitlist">
            {t.cta}
          </a>
        }
      />

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.how.title}</h2>
          <div className="agent" aria-label={t.how.aria}>
            <div className="agent-msg agent-user">
              <span className="mono">You</span>
              <p>{t.how.user}</p>
            </div>
            <div className="agent-msg agent-bot">
              <span className="mono">Agent</span>
              <p>{t.how.agent}</p>
            </div>
            <ul className="agent-actions">
              {actions.map((a) => (
                <li key={a.track + a.param}>
                  <span className="aa-track">{a.track}</span>
                  <span className="aa-param">{a.param}</span>
                  <span className="aa-val mono">
                    {a.from} → <strong>{a.to}</strong>
                  </span>
                  <span className="aa-where">{a.where}</span>
                  <span className="aa-undo mono" aria-hidden="true">
                    {t.how.undo}
                  </span>
                </li>
              ))}
            </ul>
            <p className="agent-cap">{t.how.caption}</p>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.principles.title}</h2>
          <ul className="cards3">
            {t.principles.items.map((p) => (
              <li key={p.t}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="waitlist" className="sec">
        <div className="wrap split">
          <div>
            <h2 className="h2">{t.waitlist.title}</h2>
            <p className="lede">{t.waitlist.lede}</p>
          </div>
          <RequestForm kind="waitlist" lang={lang} />
        </div>
      </section>
    </div>
  );
}
