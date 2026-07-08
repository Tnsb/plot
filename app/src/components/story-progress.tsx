"use client";

/**
 * Story bar — a thin gradient strip fixed to the very top that fills
 * as you scroll, like an IG story timer. Pure scroll listener, rAF-throttled.
 */
import { useEffect, useRef } from "react";

export function StoryProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let raf: number | null = null;
    function update() {
      raf = null;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
      el.style.width = `${pct.toFixed(1)}%`;
    }
    function onScroll() {
      if (raf == null) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="story-progress" aria-hidden>
      <span ref={ref} className="story-progress__fill" />
    </div>
  );
}
