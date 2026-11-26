# Voltamix 랜딩

`https://voltamix.studio`: BlackCoconut 뮤직테크 브랜드 Voltamix의 제품 소개 사이트입니다.
Next.js 16 (App Router) + TypeScript로 만들었습니다. `/api/request`만 서버에서 돌고, 나머지 페이지는 빌드할 때 정적 HTML로 만들어집니다.

한국어는 `/ko`, 영어는 `/en`에 있고 두 언어의 페이지 구성은 같습니다.

| 경로 (`/ko`, `/en` 뒤에) | 내용 |
|---|---|
| `/` | 브랜드 메시지("음악은 인간의 것" / "Music belongs to humans"), Manifesto, 제품 라인업. 낮(07–19시)에는 첫 화면이 밝은 하늘로, 밤에는 어둡게 그려집니다 |
| `/honenuki` | Honenuki: AI 소스의 잡음을 걷어 내 사람이 쓰는 재료로 만드는 플러그인 |
| `/volta-voice` | Volta Voice: 내 노래를 원하는 목소리로 |
| `/agentic-daw` | Agentic DAW (개발 중) + 대기 명단 폼 |
| `/just-use` | "플러그인은 왜 이렇게 비쌀까요?" + 라인업 + VST 신청 폼 |
| `/just-use/just-ds` | Just-DS vs Pro-DS 비교 화면 |
| `/api/request` | VST 신청과 대기 명단을 메일로 보내는 API |

### 언어 고르기 (`proxy.ts`)

언어가 붙지 않은 주소(`/`, `/honenuki`, 옛 링크 `/just-ds` 등)로 들어오면 아래 순서로 언어를 골라 `/ko/...` 또는 `/en/...`로 보냅니다.

1. 방문자가 직접 고른 언어 (쿠키 `vmx-lang`)
2. 브라우저 언어
3. 한국어도 영어도 아니면 English

쿼리(utm 등)는 그대로 유지합니다. 링크 미리보기 봇(카카오톡, X, Slack 등)에는 리다이렉트 대신 페이지를 바로 보여줍니다.
헤더의 **KO | EN** 토글(`components/LangSwitch.tsx`)은 보던 페이지와 섹션을 유지한 채 언어만 바꾸고, 고른 언어를 쿠키에 저장합니다.

## 자주 고칠 곳

| 하고 싶은 일 | 파일 |
|---|---|
| **문구 (한/영)** | `lib/content/` — `common.ts`(헤더·푸터·라인업·폼), `home.ts`, `products.ts`(Honenuki·Volta Voice·Agentic DAW), `justUse.ts`(Just Use·Just-DS 비교표). 한국어 객체가 기준이고, 영어 객체는 타입이 같아야 빌드가 됩니다. `\n`은 줄바꿈, `**굵게**`도 쓸 수 있습니다 |
| 제품 링크(Honenuki, Just-DS, Volta Voice) | `lib/site.ts`의 `LINKS` (비워 두면 버튼이 숨거나 문의 메일 버튼으로 바뀝니다) |
| 신청 메일을 받는 주소 | `lib/site.ts`의 `REQUEST_EMAIL` 또는 환경변수 `REQUEST_TO` |
| Pro-DS 가격과 확인 날짜 | `lib/site.ts`의 `PRO_DS_PRICE`, `PRICE_CHECKED` |
| 색 | `app/globals.css` 맨 위 `:root` (`--human`은 브랜드 색, `--c-*`는 제품별 색) |

## 신청 메일 설정 (Resend)

VST 신청 폼과 대기 명단 폼은 [Resend](https://resend.com)로 메일을 보냅니다. Vercel 환경변수에 다음을 넣으세요.

- `RESEND_API_KEY`: Resend API 키
- `REQUEST_FROM`: 보내는 주소. Resend에서 인증한 도메인이어야 합니다. 예: `Voltamix <noreply@voltamix.studio>`
- `REQUEST_TO`: 받는 주소 (선택, 기본값은 `bjw020615@blackcoconut.kr`)

키가 없으면 API가 503을 돌려주고, 폼은 방문자의 메일 앱을 열어 같은 내용을 채워 줍니다.
신청한 사람이 이메일을 남기면 그 주소가 Reply-To로 들어가므로 바로 답장할 수 있습니다.

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```
