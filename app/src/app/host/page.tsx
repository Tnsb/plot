import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, tables } from "@/db";
import { Shell } from "@/components/shell";
import { Cover } from "@/components/cover";
import { seatsTaken } from "@/agent/tools/helpers";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { getTheme } from "@/themes";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-[color:var(--color-cream-deep)] text-[color:var(--color-ink-soft)]",
  published: "bg-[color:var(--color-mint-soft)] text-[color:var(--color-mint)]",
  sold_out: "bg-[color:var(--color-butter-soft)] text-[color:var(--color-butter)]",
  completed: "bg-[color:var(--color-grape-soft)] text-[color:var(--color-grape)]",
  cancelled: "bg-[color:var(--color-blush)] text-[color:var(--color-tangerine-deep)]",
};

export default async function HostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/host");

  const myEvents = await db
    .select()
    .from(tables.events)
    .where(eq(tables.events.hostId, user.id))
    .orderBy(desc(tables.events.startsAt));

  const rows = await Promise.all(
    myEvents.map(async (e) => ({ event: e, taken: await seatsTaken(e.id) })),
  );

  const live = rows.filter(({ event }) => event.status === "published" || event.status === "sold_out").length;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-7">
        <header className="rise-in mb-6">
          <p className="kicker">showrunner mode{live > 0 ? ` · ${live} live` : ""}</p>
          <h1 className="hed text-4xl lowercase mt-3">
            you&apos;re the <em>showrunner.</em>
          </h1>
        </header>

        {/* start a new episode — cohost first, form as fallback */}
        <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr] mb-8">
          <Link
            href="/chat"
            className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-tangerine)]/30 bg-[color:var(--color-blush)] p-5 hover:-translate-y-0.5 transition-transform group"
          >
            <span className="sparkle absolute top-3 right-4 text-sm" aria-hidden>✦</span>
            <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[color:var(--color-tangerine)]">new episode</p>
            <p className="hed text-xl lowercase mt-2">tell your cohost one line</p>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">
              &ldquo;golden hour 10k saturday, 20 spots, $10 deposit&rdquo; — page, poster, chat, done.
            </p>
          </Link>
          <Link
            href="/host/new"
            className="card p-5 hover:-translate-y-0.5 transition-transform"
          >
            <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-faint)]">old school</p>
            <p className="hed text-xl lowercase mt-2">fill the form</p>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Still fast.</p>
          </Link>
        </div>

        {rows.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">🎬</p>
            <p className="hed text-2xl lowercase">no episodes yet</p>
            <p className="text-[color:var(--color-ink-soft)] mt-1">
              One sentence to your Cohost and the pilot goes live.
            </p>
          </div>
        ) : (
          <>
            <h2 className="hed text-lg lowercase mb-3">your episodes</h2>
            <div className="space-y-3">
              {rows.map(({ event, taken }) => {
                const theme = getTheme(event.theme);
                return (
                  <Link
                    key={event.id}
                    href={`/host/events/${event.id}`}
                    className="card flex items-stretch overflow-hidden hover:-translate-y-0.5 hover:border-[color:var(--color-tangerine)]/30 transition-all"
                  >
                    <Cover
                      seed={event.id}
                      theme={{ ...theme.palette, emoji: theme.emoji, cover: theme.cover }}
                      className="w-24 shrink-0"
                      scrim={false}
                    />
                    <div className="p-4 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="hed text-lg lowercase truncate">{event.title}</h3>
                        <span className={`pill !text-xs ${STATUS_STYLE[event.status]}`}>{event.status.replace("_", " ")}</span>
                      </div>
                      <p className="font-mono text-xs text-[color:var(--color-ink-faint)] mt-1.5 tabular-nums">
                        {formatDateTime(event.startsAt)} · {taken}/{event.capacity} seats · {formatPrice(event.priceCents)}
                      </p>
                      <div className="meter-track mt-2.5 max-w-40">
                        <i
                          className="meter-fill"
                          style={{ width: `${Math.min(100, Math.round((taken / Math.max(1, event.capacity)) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
