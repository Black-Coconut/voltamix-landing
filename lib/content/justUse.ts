/* Copy for /just-use and /just-use/just-ds. */
import type { Lang } from "../i18n";
import { PRICE_CHECKED, PRO_DS_PRICE } from "../site";

const P = `$${PRO_DS_PRICE}`;
const SALE = `$${Math.round(PRO_DS_PRICE * 0.75)}`;

/* ---------------- Just Use ---------------- */

const juKo = {
  metaTitle: "Just Use — 플러그인은 왜 이렇게 비쌀까요?",
  metaDesc:
    "AI로 개발비는 줄었는데 플러그인 가격은 블랙프라이데이에만 내려갑니다. Just Use는 비싼 플러그인과 같은 퀄리티의 플러그인을 항상 무료로 냅니다. 첫 번째는 Just-DS. 원하는 VST를 신청하세요.",
  q: "플러그인은 왜\n이렇게 비쌀까요?",
  talk: [
    "솔직하게 하나 물어볼게요.",
    "요즘 소프트웨어는 AI랑 같이 만듭니다. 사람이 몇 주씩 붙잡고 있던 코드가 며칠이면 나와요. 개발 인건비는 줄었고, 코드는 훨씬 빨리 나옵니다. FabFilter 같은 유명한 회사들도 아마 다 AI로 개발하고 있겠죠.",
    `그런데 플러그인 가격은 왜 그대로일까요? ${P}짜리 디에서는 올해도 ${P}입니다. 싸지는 날은 1년에 딱 한 번, **블랙프라이데이**뿐이고요.`,
  ],
  punch: "우리는 블랙프라이데이를 할 필요가 없어요.\n항상 공짜거든요.",
  after: "그렇다고 싼 게 비지떡은 아닙니다. 퀄리티는 **Pro-DS, soothe2** 같은 플러그인과 같아요. 직접 비교해 보세요.",
  rulesAria: "Just Use 원칙",
  rules: ["계정 없음", "구독 없음", "체험 기간 없음", "기능 제한 없음", "블랙프라이데이 없음"],
  chart: {
    title: "1년 동안의 가격",
    months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    aria: `1년 가격 그림. 디에서 정가 ${P}가 1년 내내 이어지다 11월 말 블랙프라이데이에만 ${SALE}로 내려갑니다. Just Use는 1년 내내 $0입니다.`,
    bf: "블랙프라이데이 −25%",
    them: `${P} · 1년 내내`,
    us: "Just Use · $0 · 1년 내내",
    caption: `정가 ${P}짜리 디에서가 블랙프라이데이에 25% 할인한다고 가정하고 그린 그림입니다.`,
  },
  lineup: {
    title: "지금 그냥 쓸 수 있는 것",
    dsBody: "치찰음은 물론, 파열음·입소리와 숨소리까지 따로 잡는 디에서.",
    dsMore: "Pro-DS와 비교하기",
    nextName: "다음은?",
    nextBody: "당신이 정하세요. 비싸서 못 산 그 플러그인, 이름만 적어 주시면 됩니다.",
    nextMore: "VST 신청하기",
  },
  request: {
    title: "원하는 VST를 신청하세요",
    lede: "비싸서 못 샀던 플러그인, 데모만 깔았다 지운 플러그인. 이름만 적어 주세요. 신청이 많은 것부터 만들어서 공짜로 풀겠습니다.",
  },
};

type JustUse = typeof juKo;

const juEn: JustUse = {
  metaTitle: "Just Use — Why are plug-ins so expensive?",
  metaDesc:
    "AI has cut development costs, yet plug-in prices only drop on Black Friday. Just Use releases plug-ins as good as the expensive ones, free, all the time. Just-DS is the first. Request the VST you want.",
  q: "Why are plug-ins\nso expensive?",
  talk: [
    "Let us ask you something, honestly.",
    "Software is built with AI now. Code that used to take people weeks comes out in days. Development costs are down and code ships far faster. Well-known companies like FabFilter are probably all building with AI too.",
    `So why haven't plug-in prices moved? A ${P} de-esser is still ${P} this year. The only day it gets cheaper is once a year: **Black Friday**.`,
  ],
  punch: "We don't need Black Friday.\nWe're always free.",
  after: "And no, free doesn't mean cheap. The quality is on par with plug-ins like **Pro-DS and soothe2**. See for yourself.",
  rulesAria: "Just Use rules",
  rules: ["No account", "No subscription", "No trial period", "No feature limits", "No Black Friday"],
  chart: {
    title: "A year of prices",
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    aria: `A year of prices. A ${P} de-esser stays at ${P} all year and only drops to ${SALE} for Black Friday at the end of November. Just Use is $0 all year.`,
    bf: "Black Friday −25%",
    them: `${P} · all year`,
    us: "Just Use · $0 · all year",
    caption: `Illustration assuming a ${P} de-esser takes 25% off on Black Friday.`,
  },
  lineup: {
    title: "Free to use, right now",
    dsBody: "A de-esser that catches sibilance and, separately, plosives, mouth clicks and breaths.",
    dsMore: "Compare with Pro-DS",
    nextName: "What's next?",
    nextBody: "You decide. Tell us the plug-in you couldn't afford. The name is enough.",
    nextMore: "Request a VST",
  },
  request: {
    title: "Request the VST you want",
    lede: "The plug-in you couldn't afford, the one you installed as a demo and deleted. Just tell us the name. We'll build the most requested ones first and release them free.",
  },
};

export const justUse: Record<Lang, JustUse> = { ko: juKo, en: juEn };

/* ---------------- Just-DS vs Pro-DS ---------------- */

export type VsRow = { label: string; them: string | boolean; us: string | boolean; note?: string; win?: "us" | "them" };

const dsKo = {
  metaTitle: "Just-DS vs Pro-DS — 무료 디에서 스펙 비교",
  metaDesc: `FabFilter Pro-DS(${P})와 무료 디에서 Just-DS($0)를 기능별로 비교합니다. Pro-DS의 핵심 기능에 파열음·입소리, 숨소리 제거까지.`,
  title: "기능은 그대로. 가격만 빼고.",
  faceAria: `FabFilter Pro-DS ${P} 대 Just-DS $0`,
  themSub: "정가 · 할인은 블랙프라이데이에",
  usSub: "평생 무료 · 계정 없음",
  ctaDownload: "Just-DS 무료 다운로드",
  ctaCompare: "한 줄씩 비교하기",
  rounds: { title: "한 줄씩 붙여 봤습니다" },
  board: {
    rounds: "개 항목",
    diffOnly: "차이만 보기",
    caption: "FabFilter Pro-DS와 Just-DS 기능 비교",
    feature: "기능",
    yes: "지원",
    no: "없음",
  },
  rows: [
    { label: "가격", them: P, us: "$0", note: "평생 무료", win: "us" },
    { label: "치찰음 제거", them: true, us: true },
    { label: "Single Vocal / Allround 검출", them: true, us: true },
    { label: "Split / Wide 처리", them: true, us: true, note: "Just-DS는 세 처리 각각 따로" },
    { label: "Lookahead (최대 15 ms)", them: true, us: true, note: "끄면 지연 0 ms" },
    { label: "검출 대역 HP/LP 필터", them: true, us: true },
    { label: "스테레오 링크 · Mid/Side", them: true, us: true },
    { label: "외부 사이드체인", them: true, us: true },
    { label: "최대 4배 오버샘플링", them: true, us: true },
    { label: "A/B 비교 · Undo/Redo", them: true, us: true },
    { label: "MIDI Learn", them: true, us: true },
    { label: "파열음·입소리(ㅌ, 쩝) 제거", them: false, us: true, win: "us" },
    { label: "숨소리·후음(ㅎ) 제거", them: false, us: true, win: "us" },
    { label: "한국어 UI", them: false, us: true, win: "us" },
    { label: "계정 · 라이선스 키", them: "필요", us: "없음", win: "us" },
    { label: "AAX (Pro Tools)", them: true, us: "아직", win: "them" },
    { label: "블랙프라이데이 기다리기", them: "필요", us: "필요 없음", win: "us" },
  ] as VsRow[],
  footnote: `Pro-DS 기능은 FabFilter 공식 제품 페이지의 기능 목록, 가격은 Sweetwater·Plugin Boutique의 정가를 기준으로 ${PRICE_CHECKED.ko}에 확인했습니다. FabFilter와 Pro-DS는 FabFilter Software Instruments B.V.의 상표이며, Just-DS는 FabFilter와 아무 관련이 없습니다.`,
  extra: {
    title: "Pro-DS는 하나를 잡습니다. Just-DS는 셋을.",
    badge: "Pro-DS엔 없음",
    items: [
      { k: "Sibilance", t: "치찰음", d: "ㅅ · ㅆ · 거친 ㅈ · ㅊ", spec: "최대 15 dB" },
      { k: "Plosives & Clicks", t: "파열음 · 입소리", d: "ㅌ · 쩝 · 혀 차는 소리", spec: "최대 6 dB" },
      { k: "Breaths", t: "숨소리 · 후음", d: "ㅎ · 들숨 · 바람 소리", spec: "최대 12 dB" },
    ],
  },
  final: { title: "돈 낼 필요 없습니다. 그냥 쓰세요.", cta: "deesser.voltamix.studio에서 받기", other: "다른 VST 신청하기" },
};

type JustDs = typeof dsKo;

const dsEn: JustDs = {
  metaTitle: "Just-DS vs Pro-DS — free de-esser, spec by spec",
  metaDesc: `FabFilter Pro-DS (${P}) and the free de-esser Just-DS ($0), compared feature by feature. Everything Pro-DS does at its core, plus plosive, mouth-click and breath removal.`,
  title: "Same features. Minus the price.",
  faceAria: `FabFilter Pro-DS ${P} versus Just-DS $0`,
  themSub: "List price · discounts on Black Friday",
  usSub: "Free forever · no account",
  ctaDownload: "Download Just-DS free",
  ctaCompare: "Compare line by line",
  rounds: { title: "Side by side, line by line" },
  board: {
    rounds: "rows",
    diffOnly: "Show differences only",
    caption: "FabFilter Pro-DS vs Just-DS feature comparison",
    feature: "Feature",
    yes: "Yes",
    no: "No",
  },
  rows: [
    { label: "Price", them: P, us: "$0", note: "Free forever", win: "us" },
    { label: "Sibilance removal", them: true, us: true },
    { label: "Single Vocal / Allround detection", them: true, us: true },
    { label: "Split / Wide processing", them: true, us: true, note: "Just-DS: per detector" },
    { label: "Lookahead (up to 15 ms)", them: true, us: true, note: "0 ms latency when off" },
    { label: "Detection band HP/LP filters", them: true, us: true },
    { label: "Stereo link · Mid/Side", them: true, us: true },
    { label: "External sidechain", them: true, us: true },
    { label: "Up to 4× oversampling", them: true, us: true },
    { label: "A/B compare · Undo/Redo", them: true, us: true },
    { label: "MIDI Learn", them: true, us: true },
    { label: "Plosive & mouth-click removal", them: false, us: true, win: "us" },
    { label: "Breath & /h/ removal", them: false, us: true, win: "us" },
    { label: "Korean UI", them: false, us: true, win: "us" },
    { label: "Account · license key", them: "Required", us: "None", win: "us" },
    { label: "AAX (Pro Tools)", them: true, us: "Not yet", win: "them" },
    { label: "Waiting for Black Friday", them: "Required", us: "Not needed", win: "us" },
  ],
  footnote: `Pro-DS features are taken from the feature list on FabFilter's official product page, and the price is the list price at Sweetwater and Plugin Boutique, both checked in ${PRICE_CHECKED.en}. FabFilter and Pro-DS are trademarks of FabFilter Software Instruments B.V. Just-DS has no connection with FabFilter.`,
  extra: {
    title: "Pro-DS catches one thing. Just-DS catches three.",
    badge: "Not in Pro-DS",
    items: [
      { k: "Sibilance", t: "Sibilance", d: "s · sh · harsh ch", spec: "Up to 15 dB" },
      { k: "Plosives & Clicks", t: "Plosives & clicks", d: "t · lip smacks · tongue clicks", spec: "Up to 6 dB" },
      { k: "Breaths", t: "Breaths", d: "h · in-breaths · air", spec: "Up to 12 dB" },
    ],
  },
  final: { title: "No need to pay. Just use it.", cta: "Get it at deesser.voltamix.studio", other: "Request another VST" },
};

export const justDs: Record<Lang, JustDs> = { ko: dsKo, en: dsEn };
