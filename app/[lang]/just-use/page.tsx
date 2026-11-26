import type { Metadata } from "next";
import Link from "next/link";
import RequestForm from "@/components/RequestForm";
import ProductHero from "@/components/ProductHero";
import { common } from "@/lib/content/common";
import { justUse } from "@/lib/content/justUse";
import { href, langOf } from "@/lib/i18n";
import { pageMeta } from "@/lib/meta";
import { rich } from "@/lib/rich";
import { PRO_DS_PRICE } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };
type Chart = (typeof justUse)["ko"]["chart"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await langOf(params);
  return pageMeta(lang, "/just-use", justUse[lang].metaTitle, justUse[lang].metaDesc);
}

/* One year of price, drawn by hand: list price all year, one Black Friday dip. Illustrative. */
function PriceYear({ t }: { t: Chart }) {
  const W = 720;
  const H = 220;
  const L = 48;
  const R = 16;
  const T = 20;
  const B = 34;
  const iw = W - L - R;
  const ih = H - T - B;
  const y = (v: number) => T + ih - (v / 220) * ih;
  const x = (day: number) => L + (day / 365) * iw;
  const bf0 = 330; // ~Nov 27
  const bf1 = 335; // ~Dec 1
  const sale = Math.round(PRO_DS_PRICE * 0.75);
  const them = `M${x(0)},${y(PRO_DS_PRICE)} L${x(bf0)},${y(PRO_DS_PRICE)} L${x(bf0)},${y(sale)} L${x(bf1)},${y(sale)} L${x(bf1)},${y(PRO_DS_PRICE)} L${x(365)},${y(PRO_DS_PRICE)}`;

  return (
    <figure className="pyear">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.aria}>
        {[0, 100, 200].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} className="pyear-grid" />
            <text x={L - 8} y={y(v) + 4} textAnchor="end" className="pyear-axis">
              ${v}
            </text>
          </g>
        ))}
        {t.months.map((m, i) => (
          <text key={m} x={x(i * 30.4 + 15)} y={H - 10} textAnchor="middle" className="pyear-axis">
            {m}
          </text>
        ))}
        <path d={them} className="pyear-them" />
        <line x1={x(0)} x2={x(365)} y1={y(0)} y2={y(0)} className="pyear-us" />
        <text x={x(bf0) - 6} y={y(sale) + 18} textAnchor="end" className="pyear-label">
          {t.bf}
        </text>
        <text x={x(150)} y={y(PRO_DS_PRICE) - 8} textAnchor="middle" className="pyear-label">
          {t.them}
        </text>
        <text x={x(150)} y={y(0) - 8} textAnchor="middle" className="pyear-label pyear-label-us">
          {t.us}
        </text>
      </svg>
      <figcaption>{t.caption}</figcaption>
    </figure>
  );
}

export default async function JustUsePage({ params }: Props) {
  const lang = await langOf(params);
  const t = justUse[lang];

  return (
    <div data-p="justUse">
      <ProductHero
        className="ju-hero"
        titleClass="ju-q"
        mineral="sulfur"
        mark="Just Use"
        tag={
          <>
            <span>{common[lang].products.justUse.kind}</span>
          </>
        }
        title={t.q}
      />

      <section className="ju-talk-sec">
        <div className="wrap">
          <div className="ju-talk">
            {t.talk.map((p, i) => (
              <p key={i}>{rich(p)}</p>
            ))}
            <p className="ju-punch">{rich(t.punch)}</p>
            <p>{rich(t.after)}</p>
          </div>
          <ul className="ju-rules" aria-label={t.rulesAria}>
            {t.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.chart.title}</h2>
          <PriceYear t={t.chart} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2">{t.lineup.title}</h2>
          <ul className="ju-list">
            <li>
              <Link href={href(lang, "/just-use/just-ds")} className="ju-card">
                <div className="ju-card-top">
                  <span className="tag">Just-DS</span>
                  <span className="badge badge-free">{common[lang].products.justUse.status?.label}</span>
                </div>
                <p className="ju-card-name">Just-DS</p>
                <p className="ju-card-vs">
                  vs FabFilter Pro-DS
                </p>
                <p className="ju-card-price">
                  <s>${PRO_DS_PRICE}</s> <strong>$0</strong>
                </p>
                <p>{t.lineup.dsBody}</p>
                <span className="ju-card-more">{t.lineup.dsMore}</span>
              </Link>
            </li>
            <li>
              <a href="#request" className="ju-card ju-card-next">
                <p className="ju-card-name">{t.lineup.nextName}</p>
                <p>{t.lineup.nextBody}</p>
                <span className="ju-card-more">{t.lineup.nextMore}</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section id="request" className="sec">
        <div className="wrap split">
          <div>
            <h2 className="h2">{t.request.title}</h2>
            <p className="lede">{t.request.lede}</p>
          </div>
          <RequestForm kind="vst" lang={lang} />
        </div>
      </section>
    </div>
  );
}
