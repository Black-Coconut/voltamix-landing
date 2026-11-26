import { Instrument_Serif, Inter_Tight, JetBrains_Mono, Noto_Sans_KR } from "next/font/google";

export const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-sans",
  display: "swap",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--f-serif",
  display: "swap",
});

export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--f-mono",
  display: "swap",
});

// Korean glyphs come as unicode-range chunks; only the ones a page uses are downloaded.
export const kr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--f-kr",
  display: "swap",
  preload: false,
});
