/** Cinematic cover art per event — real theme photos tinted by the palette,
 *  with deterministic gradients as the no-theme fallback. */

const GRADIENTS = [
  "linear-gradient(150deg, #7f1d4d, #ff2d55 60%, #ff8a5c)",
  "linear-gradient(150deg, #312e51, #6c4ab6 60%, #e5397f)",
  "linear-gradient(150deg, #7c2d12, #e05a28 60%, #ffc94a)",
  "linear-gradient(150deg, #134e4a, #0d9488 65%, #9d7bff)",
  "linear-gradient(150deg, #4a1d96, #e5397f 60%, #ffc94a)",
];

const EMOJI = ["🍷", "🕯️", "🍜", "🥂", "🌶️", "🍋", "🫒", "🍑"];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function coverStyle(seed: string): React.CSSProperties {
  return { background: GRADIENTS[hash(seed) % GRADIENTS.length] };
}

export function coverEmoji(seed: string): string {
  return EMOJI[hash(seed) % EMOJI.length];
}

export function Cover({
  seed,
  className,
  children,
  theme,
  scrim = true,
}: {
  seed: string;
  className?: string;
  children?: React.ReactNode;
  /** theme palette override — themes re-render the night, not re-skin it */
  theme?: { from: string; to: string; accent: string; emoji?: string; cover?: string };
  /** dark gradient scrim at the bottom so overlaid type stays legible */
  scrim?: boolean;
}) {
  const style = theme
    ? {
        background: `radial-gradient(circle at 80% 12%, ${theme.accent}66, transparent 46%), linear-gradient(150deg, ${theme.from}, ${theme.to})`,
      }
    : coverStyle(seed);
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} style={style}>
      {theme?.cover ? (
        <>
          {/* the real photo, graded by the theme palette like film stock */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme.cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-multiply opacity-55"
            style={{ background: `linear-gradient(150deg, ${theme.from}, ${theme.to})` }}
          />
        </>
      ) : (
        <span
          aria-hidden
          className="absolute -right-4 -bottom-6 text-[7rem] opacity-25 select-none rotate-12"
        >
          {theme?.emoji ?? coverEmoji(seed)}
        </span>
      )}
      {scrim ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#08080dE0] via-[#08080d40] to-transparent"
        />
      ) : null}
      {children}
    </div>
  );
}
