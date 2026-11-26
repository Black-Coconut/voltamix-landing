"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Starts the shared canvas (lib/minerals/stage.ts) on every page, so the lit field sits behind pages without stones too,
   and re-reads the page's colours after each navigation. Renders nothing itself. */
export default function Backdrop() {
  const pathname = usePathname();

  useEffect(() => {
    let gone = false;
    import("@/lib/minerals/stage")
      .then((m) => {
        if (!gone) m.mount();
      })
      .catch(() => {});
    return () => {
      gone = true;
    };
  }, [pathname]);

  return null;
}
