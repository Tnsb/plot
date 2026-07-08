import Link from "next/link";
import { and, gt, inArray } from "drizzle-orm";
import { db, tables } from "@/db";
import { Shell } from "@/components/shell";
import { EventCard, FeaturedPoster } from "@/components/event-card";
import { WordCycle } from "@/components/word-cycle";
import { seatsTaken } from "@/agent/tools/helpers";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default async function HomePage() {
  const user = await getCurrentUser();
  const upcoming = await db
    .select()
    .from(tables.events)
    .where(
      and(
        inArray(tables.events.status, ["published", "sold_out"]),
        gt(tables.events.startsAt, new Date()),
      ),
    )
    .orderBy(tables.events.startsAt)
    .limit(12);

  const withSeats = await Promise.all(
    upcoming.map(async (e) => ({ event: e, seatsLeft: e.capacity - (await seatsTaken(e.id)) })),
  );

  const [featured, ...rest] = withSeats;
  const now = new Date();
  const stamp = `${DAY[now.getDay()]} · ${String(now.getMonth() + 1).padStart(2, "0")}.${String(
    now.getDate(),
  ).padStart(2, "0")}`;

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-4">
        {/* hero */}
        <div className="rise-in relative">
          <span className="sparkle absolute -top-1 right-[12%] text-lg hidden sm:inline" aria-hidden>✦</span>
          <span className="sparkle absolute top-14 right-[4%] text-xs hidden sm:inline" aria-hidden>✧</span>
          <p className="kicker">{stamp} · episodes airing near you</p>
          <h1 className="hed text-4xl md:text-6xl mt-4 lowercase">
            what&apos;s the <em className="hed-glow">plot</em>
            <br />
            <span className="text-[color:var(--color-ink-soft)] font-semibold">
              <WordCycle words={["tonight?", "the dinner?", "the run?", "game night?"]} />
            </span>
          </h1>
        </div>

        {withSeats.length === 0 ? (
          <div className="card p-10 mt-8 text-center">
            <p className="text-4xl mb-3">🎬</p>
            <p className="hed text-2xl lowercase">no episodes yet</p>
            <p className="text-[color:var(--color-ink-soft)] mt-2 max-w-sm mx-auto">
              Be the first — tell your Cohost one sentence and a bookable night goes live in a
              minute.
            </p>
            <Link href={user ? "/chat" : "/login?next=/chat"} className="btn btn-primary mt-6">
              start the plot ✦
            </Link>
          </div>
        ) : (
          <>
            {/* featured episode */}
            <div className="mt-7 md:mt-9">
              <FeaturedPoster event={featured.event} seatsLeft={featured.seatsLeft} />
            </div>

            {/* the rest of the week */}
            {rest.length > 0 ? (
              <section id="upcoming" className="mt-10">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="hed text-xl lowercase">this week</h2>
                  <span className="kicker !text-[0.58rem] before:hidden">
                    {rest.length} more episode{rest.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
                  {rest.map(({ event, seatsLeft }) => (
                    <EventCard key={event.id} event={event} seatsLeft={seatsLeft} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}

        {/* one line → a whole party */}
        <Link
          href={user ? "/chat" : "/login?next=/chat"}
          className="card mt-10 p-4 flex items-center gap-3.5 hover:border-[color:var(--color-tangerine)]/40 transition-colors group"
        >
          <span className="size-9 shrink-0 rounded-full bg-[color:var(--color-blush)] text-[color:var(--color-tangerine)] grid place-items-center">
            ✦
          </span>
          <p className="text-sm text-[color:var(--color-ink-soft)]">
            <b className="text-[color:var(--color-ink)] font-semibold">throw your own</b> — type one
            line, get a whole party
          </p>
          <span className="ml-auto font-mono text-[color:var(--color-ink-faint)] group-hover:text-[color:var(--color-tangerine)] transition-colors">
            ▍
          </span>
        </Link>

        {/* the whole night, handled — the full deck */}
        <section className="mt-10 mb-4">
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="hed text-xl lowercase">every night is an <em>episode</em></h2>
            <span className="sparkle text-sm" aria-hidden>✦</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                tag: "before",
                name: "one sentence in",
                copy: "“murder mystery dinner sat, 12 seats, $45” → live page, poster, group chat with your Cohost inside.",
              },
              {
                tag: "before",
                name: "drop-style seats",
                copy: "Countdowns, waitlist auto-backfill, past-guest early access, mystery seats and duo tickets.",
              },
              {
                tag: "during",
                name: "one shot each",
                copy: "Every guest gets exactly one cinematic capture — the theme's film stock, no retakes, no gallery.",
              },
              {
                tag: "during",
                name: "overheard + twists",
                copy: "Anonymous quotes from the table become shareable cards; your Cohost drops one plot twist mid-night.",
              },
              {
                tag: "after",
                name: "the reveal",
                copy: "The roll develops overnight and drops for everyone at the same minute — title card, recap, superlatives.",
              },
              {
                tag: "after",
                name: "taps + the tab",
                copy: "Double-blind vibe/collab/crush taps with your Cohost as wingman — and costs split without the awkward text.",
              },
            ].map((a) => (
              <div
                key={a.name}
                className="card p-5 hover:-translate-y-1 hover:border-[color:var(--color-tangerine)]/30 transition-all duration-300"
              >
                <span className="chip !bg-[color:var(--color-cream-deep)] !text-[color:var(--color-ink-soft)] !border-[color:var(--hairline)]">{a.tag}</span>
                <p className="hed text-lg lowercase mt-3">{a.name}</p>
                <p className="text-sm text-[color:var(--color-ink-soft)] mt-1.5 leading-relaxed">
                  {a.copy}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
