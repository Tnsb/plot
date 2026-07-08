import Link from "next/link";
import { Cover } from "./cover";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getTheme } from "@/themes";
import type { Event } from "@/db/schema";

/** grid poster — theme gradient is the card, title sits on the art */
export function EventCard({ event, seatsLeft }: { event: Event; seatsLeft: number }) {
  const soldOut = event.status === "sold_out" || seatsLeft <= 0;
  const theme = getTheme(event.theme);
  return (
    <Link
      href={`/e/${event.id}`}
      className="group block rounded-[var(--radius-card)] overflow-hidden border border-[color:var(--hairline)] hover:-translate-y-1 transition-transform duration-300"
    >
      <Cover seed={event.id} theme={{ ...theme.palette, emoji: theme.emoji, cover: theme.cover }} className="aspect-[3/4]">
        <div className="absolute top-3 left-3 right-3 flex justify-between gap-2">
          <span className="chip">{formatPrice(event.priceCents)}</span>
          {soldOut ? (
            <span className="sticker sticker--butter">sold out</span>
          ) : seatsLeft <= 3 ? (
            <span className="sticker">{seatsLeft} left</span>
          ) : null}
        </div>
        <div className="absolute bottom-0 inset-x-0 p-4">
          <p className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#f4f2ec]/70 mb-1.5 tabular-nums">
            {formatDateTime(event.startsAt)}
          </p>
          <h3 className="hed text-xl lowercase text-[#f4f2ec] group-hover:text-white transition-colors">
            {event.title}
          </h3>
          {event.locationHint ? (
            <p className="text-xs text-[#f4f2ec]/60 mt-1 line-clamp-1">
              {event.locationHint}
            </p>
          ) : null}
        </div>
      </Cover>
    </Link>
  );
}

/** the big one — tonight's featured episode, full-width */
export function FeaturedPoster({ event, seatsLeft }: { event: Event; seatsLeft: number }) {
  const soldOut = event.status === "sold_out" || seatsLeft <= 0;
  const theme = getTheme(event.theme);
  return (
    <Link
      href={`/e/${event.id}`}
      className="group block rounded-[28px] overflow-hidden border border-[color:var(--hairline)] shadow-[var(--shadow-warm-lg)] active:scale-[0.99] transition-transform duration-300"
    >
      <Cover
        seed={event.id}
        theme={{ ...theme.palette, emoji: theme.emoji, cover: theme.cover }}
        className="aspect-[4/4.6] sm:aspect-[16/9]"
      >
        <div className="absolute top-4 left-4 right-4 flex justify-between gap-2">
          <span className="chip">
            {theme.emoji} {theme.name}
          </span>
          {soldOut ? (
            <span className="sticker sticker--butter">sold out</span>
          ) : seatsLeft <= 3 ? (
            <span className="sticker">{seatsLeft} left</span>
          ) : (
            <span className="chip">{formatPrice(event.priceCents)}</span>
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7">
          <p className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.12em] text-[#f4f2ec]/75 mb-2 tabular-nums">
            {formatDateTime(event.startsAt)}
            {event.locationHint ? ` · ${event.locationHint}` : ""}
          </p>
          <h3 className="hed text-3xl sm:text-4xl lowercase text-[#f4f2ec] max-w-xl">
            {event.title}
          </h3>
          {event.vibe ? (
            <p className="mt-2 text-sm text-[#f4f2ec]/65 line-clamp-1 max-w-md">
              <em className="font-serif italic">{event.vibe}</em>
            </p>
          ) : null}
          <span className="mt-4 inline-flex items-center rounded-full bg-[#f4f2ec] text-[#0b0a12] text-[0.8rem] font-bold px-4 py-2.5">
            {soldOut ? "join the waitlist" : `${formatPrice(event.priceCents)} · grab a seat`}
          </span>
        </div>
      </Cover>
    </Link>
  );
}
