"use client";

import { useEffect, useState } from "react";

/**
 * The circular counter in a sticky art card (SynthCoder's "1/5"). It follows which
 * of the blocks in its section is crossing the middle of the viewport.
 */
export default function Counter({ selector, total, ring }: { selector: string; total: number; ring: string }) {
  const [n, setN] = useState(1);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setN(els.indexOf(e.target as HTMLElement) + 1);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector]);

  const text = `${ring} · ${ring} · `;
  return (
    <div className="art__count" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <path id={`ring-${selector.replace(/[^a-z]/gi, "")}`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text>
          <textPath href={`#ring-${selector.replace(/[^a-z]/gi, "")}`}>{text}</textPath>
        </text>
      </svg>
      <b>
        {String(n).padStart(2, "0")}
        <span>/{String(total).padStart(2, "0")}</span>
      </b>
    </div>
  );
}
