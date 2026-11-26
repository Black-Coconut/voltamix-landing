/* Copy shared by every page: header, footer, lineup, forms. Korean is the source; English must match its shape. */
import type { Lang } from "../i18n";

export type ProductKey = "honenuki" | "voltaVoice" | "agenticDaw" | "justUse";

/* Each product is shown as a mineral specimen (components/Mineral.tsx, lib/minerals/shapes.ts). */
export type MineralKey = "quartz" | "fluorite" | "pyrite" | "sulfur";

const PRODUCT_BASE: { key: ProductKey; no: string; name: string; path: string; mineral: MineralKey }[] = [
  { key: "honenuki", no: "01", name: "Honenuki", path: "/honenuki", mineral: "quartz" },
  { key: "voltaVoice", no: "02", name: "Volta Voice", path: "/volta-voice", mineral: "fluorite" },
  { key: "agenticDaw", no: "03", name: "Agentic DAW", path: "/agentic-daw", mineral: "pyrite" },
  { key: "justUse", no: "04", name: "Just Use", path: "/just-use", mineral: "sulfur" },
];

export const MINERAL_OF: Record<ProductKey, MineralKey> = {
  honenuki: "quartz",
  voltaVoice: "fluorite",
  agenticDaw: "pyrite",
  justUse: "sulfur",
};

const ko = {
  skip: "본문으로 건너뛰기",
  homeAria: "Voltamix 홈",
  navAria: "제품",
  menu: "메뉴",
  menuAria: "메뉴 열기",
  langAria: "언어 선택",
  /* Voltamix's own line. ("No Suno, No Seedance. Art originates from what is human." belongs to BlackCoconut, not here.) */
  catch: { l1: "음악은", l2: "인간의 것." },
  minerals: { quartz: "석영", fluorite: "형석", pyrite: "황철석", sulfur: "황" },
  site: {
    title: "Voltamix — 음악은 인간의 것",
    description:
      "Voltamix는 BlackCoconut의 뮤직테크 브랜드입니다. 음악은 사람의 것이라는 생각으로, AI를 사람이 쥔 과정 안의 도구로 쓰는 플러그인을 만듭니다. Honenuki, Volta Voice, Agentic DAW, Just Use.",
    ogTitle: "음악은 인간의 것 — Voltamix",
  },
  products: {
    honenuki: {
      kind: "VST3 / AU",
      status: null as null | { label: string; tone: "dev" | "free" },
      line: "AI 음악을, 당신의 재료로",
      body: "AI로 뽑은 소스에 남는 쇳소리, 고역 히스, 치찰음만 걷어냅니다. 사람이 다시 손댈 수 있는 소스로 돌려놓는 플러그인입니다.",
    },
    voltaVoice: {
      kind: "보이스 플러그인",
      status: null as null | { label: string; tone: "dev" | "free" },
      line: "내 노래를, 원하는 목소리로",
      body: "부른 사람은 당신입니다. 음정, 박자, 숨, 꺾기는 그대로 두고 음색만 원하는 목소리로 바꿉니다.",
    },
    agenticDaw: {
      kind: "DAW",
      status: { label: "개발 중", tone: "dev" } as null | { label: string; tone: "dev" | "free" },
      line: "의도를 알아듣는 DAW",
      body: "말로 의도를 전하면 에이전트가 믹싱과 마스터링을 돕습니다. 바뀐 값은 전부 보이고, 전부 되돌릴 수 있습니다.",
    },
    justUse: {
      kind: "무료 플러그인",
      status: { label: "무료", tone: "free" } as null | { label: string; tone: "dev" | "free" },
      line: "비싼 플러그인, 그냥 쓰세요",
      body: "터무니없이 비싼 플러그인과 같은 일을 하는 플러그인을 공짜로 냅니다. 첫 번째는 Just-DS입니다.",
    },
  },
  footer: {
    aboutBefore: "Voltamix는 ",
    aboutAfter: "의 뮤직테크 브랜드입니다. BlackCoconut은 음악, 게임, 영화를 위한 엔터테크를 만듭니다.",
    aria: "하단 메뉴",
    companyAria: "회사",
    request: "VST 신청",
    legal:
      "Suno, FabFilter, Pro-DS, soothe2는 각 소유자의 상표이며 Voltamix와 제휴, 후원, 보증 관계가 없습니다. VST는 Steinberg Media Technologies GmbH의 상표이고, Audio Units는 Apple Inc.의 상표입니다.",
  },
  form: {
    pluginLabel: "갖고 싶은 플러그인",
    pluginPh: "예: soothe2, Pro-Q 4 같은 다이내믹 EQ",
    vstMsgLabel: "어디에 쓰고 싶은지 (선택)",
    vstMsgPh: "예: 보컬 공진 잡는 데 매번 쓰는데 너무 비싸요.",
    waitMsgLabel: "어떤 작업을 하시나요? (선택)",
    waitMsgPh: "예: 홈레코딩으로 EP를 만들고 있고, 믹싱이 제일 어렵습니다.",
    vstEmailLabel: "이메일 (선택, 나오면 알려 드려요)",
    waitEmailLabel: "이메일",
    honeypot: "웹사이트",
    sending: "보내는 중…",
    vstSubmit: "신청하기",
    waitSubmit: "대기 명단에 올리기",
    note: (email: string) => `${email}로 바로 전달됩니다.`,
    vstDone: "신청 받았습니다.",
    vstDoneBody: "신청이 많은 것부터 만듭니다. 이메일을 남기셨다면 나왔을 때 알려 드릴게요.",
    vstAgain: "하나 더 신청하기",
    waitDone: "대기 명단에 올렸습니다.",
    waitDoneBody: "테스트를 시작하면 가장 먼저 연락드릴게요.",
    waitAgain: "하나 더 보내기",
    mailtoOpened: "메일 앱을 열었습니다. 열리지 않았다면",
    mailtoLink: "여기를 눌러 메일로 보내 주세요",
    mailDirect: "메일로 직접 보내기",
    errors: {
      bad_request: "잘못된 요청입니다.",
      plugin_required: "갖고 싶은 플러그인 이름을 적어 주세요.",
      email_required: "이메일을 적어 주세요.",
      email_invalid: "이메일 형식을 확인해 주세요.",
      send_failed: "메일 서버 오류로 보내지 못했습니다.",
      network: "네트워크 오류로 보내지 못했습니다.",
      unknown: "보내지 못했습니다.",
    } as Record<string, string>,
    mailSubjectVst: "[Just Use 신청]",
    mailSubjectWait: "[Agentic DAW 대기 명단]",
    mailPlugin: "원하는 플러그인",
    mailEmail: "회신 이메일",
  },
};

export type Common = typeof ko;

const en: Common = {
  skip: "Skip to content",
  homeAria: "Voltamix home",
  navAria: "Products",
  menu: "Menu",
  menuAria: "Open menu",
  langAria: "Language",
  catch: { l1: "Music belongs", l2: "to humans." },
  minerals: { quartz: "Quartz", fluorite: "Fluorite", pyrite: "Pyrite", sulfur: "Sulfur" },
  site: {
    title: "Voltamix — Music belongs to humans",
    description:
      "Voltamix is the music tech brand of BlackCoconut. Music belongs to people, so we build plug-ins that put AI inside a process people control. Honenuki, Volta Voice, Agentic DAW and Just Use.",
    ogTitle: "Music belongs to humans — Voltamix",
  },
  products: {
    honenuki: {
      kind: "VST3 / AU",
      status: null,
      line: "AI music, as your raw material",
      body: "Strips the metallic ringing, high-frequency hiss and sibilance that AI-generated sources leave behind, so a person can pick the material up and work with it.",
    },
    voltaVoice: {
      kind: "Voice plug-in",
      status: null,
      line: "Your song, in the voice you want",
      body: "You're the one who sang it. Pitch, timing, breath and phrasing stay as they are; only the timbre changes.",
    },
    agenticDaw: {
      kind: "DAW",
      status: { label: "In development", tone: "dev" },
      line: "A DAW that understands intent",
      body: "Tell it what you're after and an agent helps you mix and master. Every change is visible, and every change can be undone.",
    },
    justUse: {
      kind: "Free plug-ins",
      status: { label: "Free", tone: "free" },
      line: "Expensive plug-ins. Just use them",
      body: "Free plug-ins that do what absurdly priced ones do. Just-DS is the first.",
    },
  },
  footer: {
    aboutBefore: "Voltamix is the music tech brand of ",
    aboutAfter: ". BlackCoconut builds entertainment tech for music, games and film.",
    aria: "Footer",
    companyAria: "Company",
    request: "Request a VST",
    legal:
      "Suno, FabFilter, Pro-DS and soothe2 are trademarks of their respective owners. Voltamix is not affiliated with, sponsored or endorsed by them. VST is a trademark of Steinberg Media Technologies GmbH. Audio Units is a trademark of Apple Inc.",
  },
  form: {
    pluginLabel: "The plug-in you want",
    pluginPh: "e.g. soothe2, a dynamic EQ like Pro-Q 4",
    vstMsgLabel: "What you'd use it for (optional)",
    vstMsgPh: "e.g. I use it on every vocal for resonances, but it's too expensive.",
    waitMsgLabel: "What do you work on? (optional)",
    waitMsgPh: "e.g. I'm making an EP at home, and mixing is the hardest part.",
    vstEmailLabel: "Email (optional, we'll tell you when it's out)",
    waitEmailLabel: "Email",
    honeypot: "Website",
    sending: "Sending…",
    vstSubmit: "Send request",
    waitSubmit: "Join the waitlist",
    note: (email: string) => `Goes straight to ${email}.`,
    vstDone: "Request received.",
    vstDoneBody: "We build the most requested ones first. If you left an email, we'll let you know when it's out.",
    vstAgain: "Request another",
    waitDone: "You're on the waitlist.",
    waitDoneBody: "We'll reach out first when testing starts.",
    waitAgain: "Send another",
    mailtoOpened: "We opened your mail app. If nothing happened,",
    mailtoLink: "click here to send it by email",
    mailDirect: "Send by email instead",
    errors: {
      bad_request: "Something was wrong with the request.",
      plugin_required: "Please tell us which plug-in you want.",
      email_required: "Please enter your email.",
      email_invalid: "Please check your email address.",
      send_failed: "The mail server failed to send it.",
      network: "A network error stopped it from sending.",
      unknown: "It couldn't be sent.",
    },
    mailSubjectVst: "[Just Use request]",
    mailSubjectWait: "[Agentic DAW waitlist]",
    mailPlugin: "Plug-in",
    mailEmail: "Reply email",
  },
};

export const common: Record<Lang, Common> = { ko, en };

export function productsFor(lang: Lang) {
  return PRODUCT_BASE.map((p) => ({ ...p, ...common[lang].products[p.key] }));
}
