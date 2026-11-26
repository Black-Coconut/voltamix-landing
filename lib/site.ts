/* Site-wide settings. Edit links here; an empty string hides that button. */

export const SITE_URL = "https://voltamix.studio";
export const SITE_NAME = "Voltamix";
export const PARENT = { name: "BlackCoconut", url: "https://blackcoconut.kr" };

/* VST requests and the Agentic DAW waitlist are mailed here (app/api/request/route.ts).
   REQUEST_TO in the environment overrides it. */
export const REQUEST_EMAIL = "bjw020615@blackcoconut.kr";

export const LINKS = {
  honenuki: "https://honenuki.com",
  justDs: "https://deesser.voltamix.studio",
  voltaVoice: "", // product page or store, when there is one
} as const;

/* Pro-DS list price used on the Just Use pages.
   Checked 2026-11 at Sweetwater and Plugin Boutique ($199.00). Re-check before changing copy. */
export const PRO_DS_PRICE = 199;
export const PRICE_CHECKED = { ko: "2026년 11월", en: "November 2026" };
