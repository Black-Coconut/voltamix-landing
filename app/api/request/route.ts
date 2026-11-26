import { REQUEST_EMAIL } from "@/lib/site";

/* VST requests (Just Use) and the Agentic DAW waitlist.
   Sends a plain-text mail through Resend. Without RESEND_API_KEY it answers 503
   and the form falls back to opening the visitor's mail app. */

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function oneLine(s: string) {
  return s.replace(/[\r\n]+/g, " ");
}

function json(body: object, status = 200) {
  return Response.json(body, { status });
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const kind = data.kind === "waitlist" ? "waitlist" : "vst";
  const lang = data.lang === "en" ? "en" : "ko";
  const plugin = oneLine(field(data.plugin, 120));
  const message = field(data.message, 2000);
  const email = oneLine(field(data.email, 200));

  // Honeypot filled → pretend it worked.
  if (field(data.website, 200)) return json({ ok: true });

  if (kind === "vst" && !plugin) return json({ error: "plugin_required" }, 400);
  if (kind === "waitlist" && !email) return json({ error: "email_required" }, 400);
  if (email && !EMAIL_RE.test(email)) return json({ error: "email_invalid" }, 400);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ error: "not_configured" }, 503);

  const subject = kind === "vst" ? `[Just Use 신청] ${plugin}` : `[Agentic DAW 대기 명단] ${email}`;
  const text = [
    kind === "vst" ? "Just Use VST 신청이 들어왔습니다." : "Agentic DAW 대기 명단 신청이 들어왔습니다.",
    "",
    kind === "vst" ? `원하는 플러그인: ${plugin}` : null,
    `이메일: ${email || "(남기지 않음)"}`,
    `페이지 언어: ${lang === "en" ? "English" : "한국어"}`,
    "",
    message ? `내용:\n${message}` : "내용: (없음)",
    "",
    `— voltamix.studio · ${new Date().toISOString()}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.REQUEST_FROM || "Voltamix <onboarding@resend.dev>",
      to: [process.env.REQUEST_TO || REQUEST_EMAIL],
      ...(email ? { reply_to: email } : {}),
      subject,
      text,
    }),
  });

  if (!res.ok) {
    console.error("request mail failed", res.status, await res.text().catch(() => ""));
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true });
}
