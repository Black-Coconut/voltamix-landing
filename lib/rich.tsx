import { Fragment, type ReactNode } from "react";

/** Copy strings: "\n" becomes a line break, **text** becomes <strong>. */
export function rich(s: string): ReactNode {
  return s.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part,
      )}
    </Fragment>
  ));
}
