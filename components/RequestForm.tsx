"use client";

import { useState, type FormEvent } from "react";
import { common } from "@/lib/content/common";
import type { Lang } from "@/lib/i18n";
import { REQUEST_EMAIL } from "@/lib/site";

type Kind = "vst" | "waitlist";
type State = { s: "idle" } | { s: "sending" } | { s: "sent" } | { s: "mailto"; href: string } | { s: "error"; msg: string; href: string };

export default function RequestForm({ kind, lang }: { kind: Kind; lang: Lang }) {
  const t = common[lang].form;
  const [state, setState] = useState<State>({ s: "idle" });
  const vst = kind === "vst";

  function mailto(plugin: string, message: string, email: string) {
    const subject = vst ? `${t.mailSubjectVst} ${plugin}` : t.mailSubjectWait;
    const body = vst ? `${t.mailPlugin}: ${plugin}\n\n${message}\n\n${t.mailEmail}: ${email}` : `${message}\n\n${t.mailEmail}: ${email}`;
    return `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const plugin = String(fd.get("plugin") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const website = String(fd.get("website") ?? "");
    const href = mailto(plugin, message, email);

    setState({ s: "sending" });
    try {
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, lang, plugin, message, email, website }),
      });
      if (res.ok) {
        setState({ s: "sent" });
        return;
      }
      if (res.status === 503) {
        // Mail sending isn't configured on this deployment: hand off to the visitor's mail app.
        setState({ s: "mailto", href });
        window.location.href = href;
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setState({ s: "error", msg: t.errors[data.error ?? ""] ?? t.errors.unknown, href });
    } catch {
      setState({ s: "error", msg: t.errors.network, href });
    }
  }

  if (state.s === "sent") {
    return (
      <div className="rform-done" role="status">
        <p className="rform-done-t">{vst ? t.vstDone : t.waitDone}</p>
        <p>{vst ? t.vstDoneBody : t.waitDoneBody}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setState({ s: "idle" })}>
          {vst ? t.vstAgain : t.waitAgain}
        </button>
      </div>
    );
  }

  return (
    <form className="rform" onSubmit={onSubmit}>
      {vst && (
        <label className="rform-f">
          <span>{t.pluginLabel}</span>
          <input name="plugin" required maxLength={120} placeholder={t.pluginPh} />
        </label>
      )}
      <label className="rform-f">
        <span>{vst ? t.vstMsgLabel : t.waitMsgLabel}</span>
        <textarea name="message" maxLength={2000} rows={4} placeholder={vst ? t.vstMsgPh : t.waitMsgPh} />
      </label>
      <label className="rform-f">
        <span>{vst ? t.vstEmailLabel : t.waitEmailLabel}</span>
        <input name="email" type="email" maxLength={200} required={!vst} placeholder="you@example.com" autoComplete="email" />
      </label>
      {/* honeypot: people never see this field */}
      <label className="rform-hp" aria-hidden="true">
        {t.honeypot}
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="rform-actions">
        <button className="btn btn-primary" type="submit" disabled={state.s === "sending"}>
          {state.s === "sending" ? t.sending : vst ? t.vstSubmit : t.waitSubmit}
        </button>
        <p className="rform-note">{t.note(REQUEST_EMAIL)}</p>
      </div>
      {state.s === "mailto" && (
        <p className="rform-msg" role="status">
          {t.mailtoOpened} <a href={state.href}>{t.mailtoLink}</a>.
        </p>
      )}
      {state.s === "error" && (
        <p className="rform-msg rform-err" role="alert">
          {state.msg} <a href={state.href}>{t.mailDirect}</a>
        </p>
      )}
    </form>
  );
}
