import type { Lang } from "../i18n";

const ko = {
  lede: "Voltamix는 AI가 대신 만들어 주는 음악이 아니라, 사람이 처음부터 끝까지 손에 쥐고 만드는 음악을 위한 도구를 만듭니다.",
  ctaProducts: "제품 보기",
  ctaJustDs: "Just-DS 무료로 받기",
  stage: "연기색 수정 하나와, 궤도 위에 놓인 네 개의 광물. 포인터를 올리면 그쪽으로 돌고, 건드린 면만 울립니다.",
  manifesto: {
    title: "원하는 부분만\n수정할 수 있게",
    lede: "우리는 AI를 만들지 않고 툴을 만듭니다.\nSuno는 처음부터 다시 만들잖아요.",
    tenets: [
      {
        t: "같은 말, 다른 결과",
        d: "Diffusion 모델은 노이즈에서 출발합니다. 같은 프롬프트를 넣어도 매번 다른 결과가 나옵니다. 마음에 드는 부분은 그대로 두고 한 군데만 고치는 일, 결정성이 필요한 일에 약할 수밖에 없습니다.",
      },
      {
        t: "말로 안 되는 것들",
        d: "0.5 dB만 앞으로, 3 ms만 늦게, 숨은 조금 덜. 작업자가 귀로 아는 차이는 대부분 문장이 되지 않습니다. 말로 표현이 안 되는 것을 말로 시킬 수는 없습니다.",
      },
      {
        t: "그래서, 손잡이는 사람에게",
        d: "우리는 AI를 버리지 않습니다. AI가 할 일을 사람이 쥔 과정 안에 넣습니다. 생성 대신 정리, 대체 대신 보조. 마지막 결정은 언제나 당신이 합니다.",
      },
    ],
    demoTitle: "직접 눌러 보세요",
    pull: "AI는 작품이 될 수 없습니다.",
  },
  demo: {
    prompt: "“2절 보컬만 조금 더 따뜻하게”",
    promptAria: "같은 프롬프트로 세 번 생성한 결과",
    regenerate: "다시 생성",
    promptNote: "같은 말인데 셋 다 다릅니다. 곡 전체가 바뀝니다.",
    knobAria: "같은 노브 값으로 세 번 적용한 결과",
    knobNote: "같은 값이면 언제나 같은 결과. 멜로디는 그대로, 돌린 만큼만 바뀝니다.",
  },
  lineup: { title: "사람이 쥐는 도구들" },
  band: {
    q: "플러그인은 왜 이렇게 비쌀까요?",
    a: "개발비는 AI로 줄었는데, 가격은 블랙프라이데이에만 내려갑니다. 우리는 그날을 기다릴 필요가 없게 만들기로 했습니다.",
    cta: "Just Use 보러 가기",
  },
};

export type Home = typeof ko;

const en: Home = {
  lede: "Voltamix doesn't build AI that makes music for you. We build tools for music that people keep in their own hands, from the first idea to the final master.",
  ctaProducts: "See the lineup",
  ctaJustDs: "Get Just-DS free",
  stage: "A smoky crystal with four minerals resting on one orbit. It turns toward your pointer and rings only where you touch it.",
  manifesto: {
    title: "Change only\nthe part you want",
    lede: "We don't make AI. We make tools.\nSuno starts the whole song over.",
    tenets: [
      {
        t: "Same words, different result",
        d: "Diffusion models start from noise, so the same prompt gives a different result every time. Keeping what you like and fixing one spot is work that needs determinism, and it's exactly where they struggle.",
      },
      {
        t: "Things words can't carry",
        d: "0.5 dB forward, 3 ms later, a little less breath. Most of what an engineer hears never turns into a sentence. You can't prompt what you can't put into words.",
      },
      {
        t: "So the knobs stay with people",
        d: "We don't throw AI away. We put it inside a process a person controls: cleaning instead of generating, assisting instead of replacing. The final call is always yours.",
      },
    ],
    demoTitle: "Try it yourself",
    pull: "AI can't make a work of art.",
  },
  demo: {
    prompt: "“Make just the second verse vocal a bit warmer”",
    promptAria: "Three generations from the same prompt",
    regenerate: "Regenerate",
    promptNote: "Same words, three different takes. The whole song changes.",
    knobAria: "Three applications of the same knob value",
    knobNote: "Same value, same result, every time. The melody stays; only what you turn changes.",
  },
  lineup: { title: "Tools people hold" },
  band: {
    q: "Why are plug-ins so expensive?",
    a: "AI has cut the cost of building software, yet prices only drop on Black Friday. We decided you shouldn't have to wait for that day.",
    cta: "See Just Use",
  },
};

export const home: Record<Lang, Home> = { ko, en };
