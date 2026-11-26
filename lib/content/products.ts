/* Copy for the Honenuki, Volta Voice and Agentic DAW pages. */
import type { Lang } from "../i18n";

/* ---------------- Honenuki ---------------- */

const honenukiKo = {
  metaTitle: "Honenuki — AI 음악을, 당신의 재료로",
  metaDesc:
    "Honenuki는 AI로 만든 음원에 남는 금속성 링잉, 고역 히스, 치찰음을 걷어내는 VST 플러그인입니다. 음악은 건드리지 않고, 무엇을 남길지는 사람이 정합니다.",
  title: "AI 음악을,\n당신의 재료로",
  lede: "AI로 뽑은 소스는 그대로 쓰기엔 거칩니다. 쇳소리 같은 링잉, 고역 히스, 날카로운 치찰음이 남습니다. Honenuki는 그 잡음만 걷어 내고 음악은 건드리지 않습니다. 그 소스로 무엇을 만들지는 당신이 정합니다.",
  ctaGet: "honenuki.com에서 받기",
  ctaHow: "어떻게 쓰나요",
  flow: {
    title: "곡을 만들지 않습니다. 쓸 수 있게 다듬을 뿐.",
    steps: [
      { k: "Input", t: "AI로 만든 소스", d: "레퍼런스, 스케치, 샘플. 아이디어는 어디서 와도 됩니다." },
      { k: "Honenuki", t: "잡음만 걷어 내기", d: "링잉, 히스, 치찰음을 빼고 원본은 그대로 둡니다." },
      { k: "You", t: "당신의 작업", d: "자르고, 다시 연주하고, 녹음을 얹고, 믹스합니다. 여기서부터가 작품입니다." },
    ],
  },
  noises: {
    title: "세 가지 잡음을 한 번에",
    items: [
      { k: "Metallic ringing", t: "쇳소리 같은 링잉", d: "AI 음원 특유의 금속성 울림. 계속 남아 있는 좁은 피크만 찾아서 그 자리만 좁게 깎습니다." },
      { k: "HF hiss", t: "고역 히스", d: "윗대역에 깔리는 ‘쉬—’ 소리. 공기감은 남기고 바닥에 깔린 잡음만 걷어냅니다." },
      { k: "Sibilance", t: "치찰음 · DE-ESS", d: "생성된 보컬에서 유난히 날카로운 ㅅ, s 소리. 디에서가 따로 들어 있습니다." },
    ],
  },
  control: {
    title: "결정은 당신이",
    lede: "Honenuki는 대신 판단하지 않습니다. 자동으로 잡아 주는 건 시작점까지. 얼마나 깎고 무엇을 되살릴지는 손으로 정합니다.",
    proof: "탑티어 엔지니어·프로듀서 10명이 원곡 손실이 없다는 것을 직접 확인했습니다.",
    items: [
      { k: "Recover", d: "깎으면서 같이 빠진 공기감, 압축감, 새츄레이션, 어택을 되살립니다. 얼마나 되살릴지는 노브로 정합니다." },
      { k: "Sweetspot", d: "곡을 듣고 시작점을 자동으로 잡아 줍니다. 시작은 Honenuki가, 마무리는 당신이." },
      { k: "Presets", d: "장르별, 곡 성격별 프리셋. 비슷한 소스를 다룰 때 매번 처음부터 할 필요가 없습니다." },
      { k: "DELTA", d: "깎아 낸 소리만 따로 들어 보세요. 잡음만 들리고 음악은 들리지 않습니다." },
    ],
  },
  final: { title: "AI가 만든 걸 그대로 내지 마세요. 재료로 쓰세요.", cta: "Honenuki 받기" },
};

type Honenuki = typeof honenukiKo;

const honenukiEn: Honenuki = {
  metaTitle: "Honenuki — AI music, as your raw material",
  metaDesc:
    "Honenuki is a VST plug-in that removes the metallic ringing, high-frequency hiss and sibilance left in AI-generated audio. It leaves the music untouched, and you decide what stays.",
  title: "AI music,\nas your raw material",
  lede: "Sources pulled from AI are too rough to use as they are: metallic ringing, high-frequency hiss, harsh sibilance. Honenuki strips out just that noise and leaves the music alone. What you make from it is up to you.",
  ctaGet: "Get it at honenuki.com",
  ctaHow: "Where it fits",
  flow: {
    title: "It doesn't write songs. It makes material usable.",
    steps: [
      { k: "Input", t: "AI-generated source", d: "References, sketches, samples. Ideas can come from anywhere." },
      { k: "Honenuki", t: "Strip the noise", d: "Removes ringing, hiss and sibilance and leaves the original as it was." },
      { k: "You", t: "Your work", d: "Cut it, replay it, record over it, mix it. This is where the work begins." },
    ],
  },
  noises: {
    title: "Three kinds of noise, in one pass",
    items: [
      { k: "Metallic ringing", t: "Metallic ringing", d: "The tinny resonance typical of AI audio. Honenuki finds the narrow peaks that hang around and cuts only there." },
      { k: "HF hiss", t: "High-frequency hiss", d: "The “shhh” sitting on the top end. The air stays; the noise floor goes." },
      { k: "Sibilance", t: "Sibilance · DE-ESS", d: "The overly sharp s sounds in generated vocals. A de-esser is built in." },
    ],
  },
  control: {
    title: "You decide",
    lede: "Honenuki doesn't make the judgement for you. Automation only gets you to a starting point; how much to cut and what to bring back is done by hand.",
    proof: "Ten top-tier engineers and producers confirmed by ear that nothing of the original music is lost.",
    items: [
      { k: "Recover", d: "Brings back the air, compression, saturation and attack that went out with the noise. How much is up to the knob." },
      { k: "Sweetspot", d: "Listens to the track and sets a starting point for you. Honenuki starts; you finish." },
      { k: "Presets", d: "Presets by genre and by song character, so similar sources don't start from zero." },
      { k: "DELTA", d: "Listen to only what was removed. You'll hear noise, not music." },
    ],
  },
  final: { title: "Don't release what AI made as is. Use it as material.", cta: "Get Honenuki" },
};

export const honenuki: Record<Lang, Honenuki> = { ko: honenukiKo, en: honenukiEn };

/* ---------------- Volta Voice ---------------- */

const voiceKo = {
  metaTitle: "Volta Voice — 내 노래를, 원하는 목소리로",
  metaDesc: "Volta Voice는 내가 부른 보컬을 원하는 목소리로 바꾸는 플러그인입니다. 음정, 박자, 숨, 꺾기는 그대로 두고 음색만 바꿉니다.",
  title: "내 노래를,\n원하는 목소리로",
  lede: "부른 사람은 당신입니다. Volta Voice는 당신이 부른 보컬의 음정, 박자, 숨, 감정 표현을 그대로 두고 음색만 원하는 목소리로 바꿉니다. DAW 트랙 위에서, 플러그인으로.",
  ctaSee: "Volta Voice 보기",
  ctaContact: "문의하기",
  mailSubject: "[Volta Voice 문의]",
  perf: {
    title: "노래는 그대로. 목소리만 바뀝니다.",
    keepH: "남는 것 · 당신의 연주",
    keep: ["멜로디와 음정의 흐름", "박자와 그루브", "숨과 꺾기, 비브라토", "셈여림과 감정 표현"],
    changeH: "바뀌는 것",
    change: ["음색", "목소리의 질감"],
    lede: "Volta Voice는 노래를 새로 만들어 내지 않습니다. 입력은 언제나 당신의 테이크이고, 결과는 그 테이크를 따라갑니다. 프롬프트로 노래를 뽑는 것과는 출발점이 다릅니다.",
  },
  uses: {
    title: "이럴 때 씁니다",
    items: [
      { t: "가이드 보컬을 완성 톤으로", d: "작곡가가 직접 부른 가이드를 곡에 맞는 목소리로 바꿔, 데모 단계에서 곡을 제대로 들어 봅니다." },
      { t: "같은 곡, 다른 목소리", d: "한 테이크로 여러 톤을 들어 보고 곡에 맞는 목소리를 고릅니다." },
      { t: "코러스와 더블링", d: "같은 테이크에서 다른 결의 목소리를 만들어 레이어를 쌓습니다." },
    ],
  },
};

type Voice = typeof voiceKo;

const voiceEn: Voice = {
  metaTitle: "Volta Voice — Your song, in the voice you want",
  metaDesc: "Volta Voice is a plug-in that turns the vocal you sang into the voice you want. Pitch, timing, breath and phrasing stay; only the timbre changes.",
  title: "Your song,\nin the voice you want",
  lede: "You're the one who sang it. Volta Voice keeps the pitch, timing, breath and expression of your take and changes only the timbre to the voice you want. Right on your DAW track, as a plug-in.",
  ctaSee: "See Volta Voice",
  ctaContact: "Contact us",
  mailSubject: "[Volta Voice inquiry]",
  perf: {
    title: "The song stays. Only the voice changes.",
    keepH: "What stays · your performance",
    keep: ["Melody and pitch contour", "Timing and groove", "Breaths, bends and vibrato", "Dynamics and emotion"],
    changeH: "What changes",
    change: ["Timbre", "Vocal texture"],
    lede: "Volta Voice doesn't generate a new song. The input is always your take, and the result follows it. That's a different starting point from prompting a song into existence.",
  },
  uses: {
    title: "When to reach for it",
    items: [
      { t: "Guide vocal to finished tone", d: "Turn the songwriter's own guide into a voice that fits the song, and hear the demo the way it's meant to sound." },
      { t: "One song, many voices", d: "Audition several tones from a single take and pick the voice that suits the song." },
      { t: "Backing vocals and doubles", d: "Build layers from the same take in a different voice." },
    ],
  },
};

export const voltaVoice: Record<Lang, Voice> = { ko: voiceKo, en: voiceEn };

/* ---------------- Agentic DAW ---------------- */

const dawKo = {
  metaTitle: "Agentic DAW — 의도를 알아듣는 DAW (개발 중)",
  metaDesc:
    "Agentic DAW는 사용자의 의도를 이해하는 에이전트가 믹싱과 마스터링을 돕는 DAW입니다. 에이전트는 소리를 새로 만들지 않고, 보이는 파라미터만 움직입니다. 현재 개발 중.",
  title: "의도를 알아듣는\nDAW",
  lede: "엔지니어끼리 하던 말을 그대로 하세요. 에이전트가 의도를 이해하고 믹싱과 마스터링 과정을 거듭니다. 무엇을 바꿨는지는 전부 보입니다.",
  cta: "대기 명단에 올리기",
  how: {
    title: "말하면, 값이 움직입니다",
    aria: "Agentic DAW 화면 예시",
    user: "2절 후렴에서 보컬이 좀 더 앞으로 나왔으면 좋겠어. 근데 너무 밝아지진 않게.",
    agent:
      "2절 후렴 구간에서 보컬을 1.5 dB 올리고, 같이 밝아지지 않도록 3.2 kHz를 조금 내렸습니다. 보컬과 부딪히던 패드의 2.5 kHz도 비웠습니다. 바꾼 값 4개입니다.",
    chorus: "Chorus 2",
    whole: "전체",
    undo: "되돌리기",
    caption: "화면은 개발 중인 콘셉트 예시입니다.",
  },
  principles: {
    title: "에이전트는 조수입니다. 작곡가가 아니라.",
    items: [
      { t: "소리를 새로 만들지 않습니다", d: "에이전트는 오디오를 생성하지 않습니다. 페이더, EQ, 컴프레서처럼 DAW 안에서 보이는 파라미터만 움직입니다." },
      { t: "전부 보이고, 전부 되돌립니다", d: "바뀐 값은 하나하나 목록으로 남습니다. 마음에 안 드는 것만 골라서 끄거나 되돌릴 수 있습니다." },
      { t: "마지막 판단은 귀로", d: "에이전트는 제안하고 실행할 뿐, 승인은 당신이 합니다. 믹스의 주인은 바뀌지 않습니다." },
    ],
  },
  waitlist: { title: "먼저 써 보고 싶다면", lede: "테스트를 시작하면 대기 명단 순서대로 연락드립니다." },
};

type Daw = typeof dawKo;

const dawEn: Daw = {
  metaTitle: "Agentic DAW — A DAW that understands intent (in development)",
  metaDesc:
    "Agentic DAW is a DAW where an agent that understands your intent helps you mix and master. The agent never generates sound; it only moves parameters you can see. In development.",
  title: "A DAW that\nunderstands intent",
  lede: "Say it the way engineers say it to each other. An agent works out what you mean and helps you through the mix and the master. Everything it changed is right there to see.",
  cta: "Join the waitlist",
  how: {
    title: "You talk. The values move.",
    aria: "Agentic DAW concept screen",
    user: "In the second chorus I want the vocal a bit more upfront. But don't let it get too bright.",
    agent:
      "In chorus 2 I raised the vocal by 1.5 dB and pulled 3.2 kHz down slightly so it doesn't get brighter. I also cleared 2.5 kHz on the pad that was clashing with the vocal. 4 values changed.",
    chorus: "Chorus 2",
    whole: "Whole song",
    undo: "Undo",
    caption: "Concept preview of a product in development.",
  },
  principles: {
    title: "The agent is an assistant, not a composer",
    items: [
      { t: "It doesn't generate sound", d: "The agent never creates audio. It only moves parameters you can see in the DAW: faders, EQ, compressors." },
      { t: "Everything visible, everything undoable", d: "Each change is listed one by one. Switch off or roll back just the ones you don't like." },
      { t: "Your ears have the last word", d: "The agent suggests and carries out; you approve. The mix is still yours." },
    ],
  },
  waitlist: { title: "Want to try it first?", lede: "When testing starts, we'll get in touch in waitlist order." },
};

export const agenticDaw: Record<Lang, Daw> = { ko: dawKo, en: dawEn };
