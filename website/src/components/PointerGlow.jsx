import { useEffect } from "react";

export function PointerGlow() {
  useEffect(() => {
    const onMove = (e) => {
      document.documentElement.style.setProperty("--pointer-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${e.clientY}px`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div className="pointer-glow" aria-hidden />;
}
