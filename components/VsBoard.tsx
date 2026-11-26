"use client";

import { useState } from "react";
import type { VsRow } from "@/lib/content/justUse";

type BoardText = { rounds: string; diffOnly: string; caption: string; feature: string; yes: string; no: string };

function Cell({ v, t }: { v: string | boolean; t: BoardText }) {
  if (v === true) return <span className="vs-yes" aria-label={t.yes}>●</span>;
  if (v === false) return <span className="vs-no" aria-label={t.no}>—</span>;
  return <span className="vs-txt">{v}</span>;
}

export default function VsBoard({ rows, t }: { rows: VsRow[]; t: BoardText }) {
  const [diffOnly, setDiffOnly] = useState(false);
  const shown = diffOnly ? rows.filter((r) => r.win) : rows;

  return (
    <div className="vs-table-wrap">
      <div className="vs-tools">
        <p className="vs-tally">
          <span>
            {rows.length}
            {t.rounds.startsWith("개") ? "" : " "}
            {t.rounds}
          </span>
          <span>
            Just-DS <b>+{rows.filter((r) => r.win === "us").length}</b>
          </span>
          <span>Pro-DS +{rows.filter((r) => r.win === "them").length}</span>
        </p>
        <label className="vs-toggle">
          <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
          <span>{t.diffOnly}</span>
        </label>
      </div>
      <table className="vs-table">
        <caption className="sr-only">{t.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.feature}</th>
            <th scope="col">Pro-DS</th>
            <th scope="col">Just-DS</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.label} data-win={r.win ?? "tie"}>
              <th scope="row">
                {r.label}
                {r.note && <span className="vs-note">{r.note}</span>}
              </th>
              <td>
                <Cell v={r.them} t={t} />
              </td>
              <td>
                <Cell v={r.us} t={t} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
