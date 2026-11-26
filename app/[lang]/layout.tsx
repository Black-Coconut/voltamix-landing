import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { kr, mono, sans, serif } from "@/lib/fonts";
import { LANGS, langOf } from "@/lib/i18n";
import { common } from "@/lib/content/common";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Backdrop from "@/components/Backdrop";
import "../globals.css";

/* Root layout per language (/ko, /en) so <html lang> is right. "/" is routed in proxy.ts. */

const DAY_SCRIPT = `(function(){var d=document.documentElement,h=new Date().getHours(),p=location.pathname.replace(/[/]$/,"");if(h>=7&&h<19){d.dataset.day="1";if(p==="/ko"||p==="/en")d.dataset.sky="day";}})()`;

export const dynamicParams = false;
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const t = common[await langOf(params)].site;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: "%s | Voltamix" },
    description: t.description,
    applicationName: SITE_NAME,
  };
}

export const viewport: Viewport = {
  themeColor: "#0c0b0a",
  colorScheme: "dark",
};

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const lang = await langOf(params);
  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable} ${mono.variable} ${kr.variable}`} suppressHydrationWarning>
      <head>
        {/* Before first paint: daytime (07–19 local) lights the home page's first screen; night keeps it dark. */}
        <script dangerouslySetInnerHTML={{ __html: DAY_SCRIPT }} />
      </head>
      <body>
        <a className="skip" href="#main">
          {common[lang].skip}
        </a>
        <Header lang={lang} />
        <main id="main">{children}</main>
        <Footer lang={lang} />
        <Backdrop />
      </body>
    </html>
  );
}
