import type { ReactNode } from "react";
import Mineral from "./Mineral";
import type { MineralKey } from "@/lib/content/common";
import { rich } from "@/lib/rich";

/* Product page hero. The product's mineral is oversized and runs off the right edge; the product name is set
   as one huge outlined word along the bottom, and the headline sits over both. */
export default function ProductHero({
  mineral,
  mark,
  tag,
  title,
  lede,
  ctas,
  className,
  titleClass,
}: {
  mineral: MineralKey;
  mark: string;
  tag: ReactNode;
  title: string;
  lede?: string;
  ctas?: ReactNode;
  className?: string;
  titleClass?: string;
}) {
  return (
    <section className={className ? `ph ${className}` : "ph"} data-mineral-host>
      <Mineral kind={mineral} className="ph-stone" />
      <p className="ph-mark" aria-hidden="true">
        {mark}
      </p>
      <div className="wrap ph-in">
        <div className="ph-text enter">
          <p className="tag">{tag}</p>
          <h1 className={titleClass ? `ph-title ${titleClass}` : "ph-title"}>{rich(title)}</h1>
          {lede && <p className="ph-lede">{lede}</p>}
          {ctas && <div className="hero-ctas">{ctas}</div>}
        </div>
      </div>
    </section>
  );
}
