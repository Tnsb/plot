"use client";

/**
 * Cycles through words with a small slide-up swap — the hero asks
 * "what's the plot… tonight? the dinner? the run?" on a loop.
 * Static first word under reduced motion.
 */
import { useEffect, useState } from "react";

export function WordCycle({ words, intervalMs = 2400 }: { words: string[]; intervalMs?: number }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % words.length), intervalMs);
    return () => clearInterval(t);
  }, [words.length, intervalMs]);

  return (
    <span className="word-cycle" aria-live="off">
      {/* invisible longest word reserves width so the line never jumps */}
      <span className="word-cycle__ghost" aria-hidden>
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <span key={i} className="word-cycle__word">
        {words[i]}
      </span>
    </span>
  );
}
