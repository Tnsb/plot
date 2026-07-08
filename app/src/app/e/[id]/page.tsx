import Link from "next/link";
import { notFound } from "next/navigation";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db, tables } from "@/db";
import { Shell } from "@/components/shell";
import { Cover } from "@/components/cover";
import { Countdown } from "@/components/countdown";
import { ShareLink } from "@/components/share-link";
import { seatsTaken } from "@/agent/tools/helpers";
import { effectivePriceCents } from "@/agent/tools/tickets";
import { formatDateTime, formatPrice } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { getTheme } from "@/themes";
import { BookForm } from "./book-form";
import { CancelTicketButton } from "./cancel-button";

export const dynamic = "force-dynamic";

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event] = await db.select().from(tables.events).where(eq(tables.events.id, id));
  if (!event || event.status === "draft" || event.status === "cancelled") notFound();

  const user = await getCurrentUser();
  const [host] = await db.select().from(tables.users).where(eq(tables.users.id, event.hostId));
  const theme = getTheme(event.theme);
  const taken = await seatsTaken(event.id);
  const seatsLeft = Math.max(0, event.capacity - taken);
  const soldOut = seatsLeft === 0 || event.status === "sold_out";
  const isHost = user?.id === event.hostId;
  const past = event.startsAt < new Date() || event.status === "completed";
  const inEarlyAccess = !!event.publicAt && event.publicAt > new Date();

  const myTicket = user
    ? (
        await db
          .select()
          .from(tables.tickets)
          .where(
            and(
              eq(tables.tickets.eventId, event.id),
              eq(tables.tickets.userId, user.id),
              inArray(tables.tickets.status, ["paid", "pending", "waitlisted"]),
            ),
          )
      )[0]
    : undefined;

  // social proof: "Maya and 5 others are going"
  const goingRows = await db
    .select({ ticket: tables.tickets, guest: tables.users })
    .from(tables.tickets)
    .innerJoin(tables.users, eq(tables.tickets.userId, tables.users.id))
    .where(and(eq(tables.tickets.eventId, event.id), eq(tables.tickets.status, "paid")))
    .orderBy(asc(tables.tickets.createdAt));
  const realGoing = goingRows.filter((r) => !(r.ticket.kind === "duo_guest" && r.ticket.claimCode));
  const firstName = realGoing[0]?.guest.name?.split(" ")[0];
  const socialProof =
    realGoing.length >= 2 && firstName
      ? `${firstName} and ${realGoing.length - 1} other${realGoing.length - 1 === 1 ? "" : "s"} going`
      : realGoing.length === 1 && firstName
        ? `${firstName} is going`
        : null;

  // mystery seat still up for grabs?
  const mysterySeatOpen =
    event.mysterySeat &&
    !goingRows.some((r) => r.ticket.kind === "mystery") &&
    event.priceCents > 0;

  const [show] = event.showId
    ? await db.select().from(tables.shows).where(eq(tables.shows.id, event.showId))
    : [undefined];

  const addressUnlocked = myTicket?.status === "paid" || isHost;
  const pctTaken = Math.min(100, Math.round((taken / Math.max(1, event.capacity)) * 100));

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-5">
        {/* cover — the episode poster */}
        <Cover
          seed={event.id}
          theme={{ ...theme.palette, emoji: theme.emoji, cover: theme.cover }}
          className="rounded-[28px] border border-[color:var(--hairline)] shadow-[var(--shadow-warm-lg)] min-h-72 md:min-h-80 flex flex-col justify-end"
        >
          <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
            {event.episodeNumber ? (
              <span className="chip">
                {show ? `${show.emoji} ${show.title} · ` : ""}s{event.season ?? 1}e{event.episodeNumber}
              </span>
            ) : null}
            <span className="chip">
              {theme.emoji} {theme.name}
            </span>
            {!soldOut && seatsLeft <= 3 ? (
              <span className="chip chip--hot">{seatsLeft} left</span>
            ) : null}
          </div>

          {/* dress-code marquee riding the poster */}
          <div className="marquee relative opacity-50 mb-3 text-[#f4f2ec]" aria-hidden>
            <div>
              {Array.from({ length: 4 }).map((_, i) => (
                <span key={i}>{theme.dressCode} · </span>
              ))}
            </div>
          </div>

          <div className="relative p-5 pt-0 md:p-6 md:pt-0">
            <p className="kicker !text-[#f4f2ec]/70">
              {soldOut ? "sold out" : `selling · ${taken} of ${event.capacity} seats taken`}
            </p>
            <h1 className="hed text-4xl md:text-5xl lowercase mt-2.5 text-[#f4f2ec]">
              {event.title}
            </h1>
          </div>
        </Cover>

        <div className="mt-5 rise-in space-y-3">
          {event.vibe ? (
            <p className="font-serif italic text-xl text-[color:var(--color-ink-soft)]">
              {event.vibe}
            </p>
          ) : null}

          {/* meta grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="card p-3.5">
              <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-faint)] mb-1.5">
                when
              </p>
              <p className="text-sm font-bold tabular-nums">{formatDateTime(event.startsAt)}</p>
              {!past ? (
                <div className="mt-1.5 text-xs">
                  <Countdown to={event.startsAt.toISOString()} />
                </div>
              ) : null}
            </div>
            <div className="card p-3.5">
              <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-faint)] mb-1.5">
                seat
              </p>
              <p className="text-sm font-bold tabular-nums">
                {formatPrice(event.priceCents)}
                {event.depositCents > 0 && event.priceCents === 0 ? (
                  <span className="font-medium text-[color:var(--color-ink-soft)]">
                    {" "}
                    · {formatPrice(event.depositCents)} hold, back at check-in
                  </span>
                ) : null}
              </p>
            </div>
            <div className="card p-3.5">
              <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-faint)] mb-1.5">
                dress
              </p>
              <p className="text-sm font-bold">{theme.dressCode}</p>
            </div>
            <div className="card p-3.5">
              <p className="font-mono text-[0.56rem] font-bold uppercase tracking-[0.14em] text-[color:var(--color-ink-faint)] mb-1.5">
                host
              </p>
              <p className="text-sm font-bold">{host?.name ?? "your host"}</p>
              {socialProof ? (
                <p className="text-xs text-[color:var(--color-tangerine-deep)] mt-1">
                  🔥 {socialProof}
                </p>
              ) : null}
            </div>
          </div>

          {/* seats meter */}
          <div className="card p-4">
            <div className="flex justify-between items-baseline mb-2.5">
              <p className="text-sm font-bold">seats</p>
              <p className="font-mono text-xs font-bold text-[color:var(--color-tangerine)] tabular-nums">
                {soldOut ? "sold out" : `${seatsLeft} left`}
              </p>
            </div>
            <div className="meter-track">
              <i className="meter-fill" style={{ width: `${pctTaken}%` }} />
            </div>
          </div>

          {/* the address lock — blurred until you're in */}
          {addressUnlocked ? (
            <div className="card p-4 reveal-open flex items-center gap-3">
              <span className="text-lg">📍</span>
              <p className="text-sm font-semibold">
                {event.locationAddress ?? event.locationHint ?? "Address coming from the host"}
              </p>
            </div>
          ) : (
            <div className="relative card p-4 overflow-hidden border-dashed !border-[color:var(--hairline-strong)]">
              <p className="text-sm text-[color:var(--color-ink-soft)] blur-[7px] select-none" aria-hidden>
                {event.locationHint ?? "somewhere worth showing up to"} · exact address hidden
              </p>
              <p className="absolute inset-0 flex items-center justify-center gap-2 font-mono text-[0.68rem] font-bold uppercase tracking-[0.1em]">
                🔒 address unlocks after you&apos;re in
                {event.locationHint ? (
                  <span className="text-[color:var(--color-ink-faint)] normal-case tracking-normal">
                    · {event.locationHint}
                  </span>
                ) : null}
              </p>
            </div>
          )}

          {event.template === "run_club" ? (
            <p className="pill bg-[color:var(--color-mint-soft)] text-[color:var(--color-mint)]">
              🏃 bib numbers + waiver at booking
            </p>
          ) : null}

          {inEarlyAccess ? (
            <div className="card !bg-[color:var(--color-card-2)] p-4 text-sm flex flex-wrap items-center gap-2">
              <span className="font-bold">🔑 early access drop.</span>
              <span className="text-[color:var(--color-ink-soft)]">
                Past guests book first — doors open to everyone in
              </span>
              <Countdown to={event.publicAt!.toISOString()} />
            </div>
          ) : null}

          {event.description ? (
            <p className="pt-2 leading-relaxed text-[color:var(--color-ink-soft)] whitespace-pre-line">
              {event.description}
            </p>
          ) : null}
        </div>

        {/* booking */}
        <div className="card p-5 mt-6">
          {isHost ? (
            <div className="text-center space-y-3">
              <p className="font-semibold">This is your episode.</p>
              <Link href={`/host/events/${event.id}`} className="btn btn-ink w-full">
                Manage event & roster
              </Link>
            </div>
          ) : past ? (
            myTicket?.status === "paid" && event.status === "completed" ? (
              <Link href={`/drop/${event.id}`} className="btn btn-grape w-full">
                ✨ The Reveal is live — see how the night developed
              </Link>
            ) : (
              <p className="text-center text-[color:var(--color-ink-soft)]">
                This one already happened.{myTicket?.status === "paid" ? " The Reveal lands the morning after." : ""}
              </p>
            )
          ) : myTicket?.status === "paid" ? (
            <div className="reveal-open text-center space-y-3">
              <p className="text-3xl">🎟️</p>
              <p className="hed text-2xl lowercase">you&apos;re in.</p>
              <p className="text-[color:var(--color-ink-soft)]">
                📍 <strong className="text-[color:var(--color-ink)]">{event.locationAddress ?? "Address coming from the host"}</strong>
              </p>
              <Link href={`/party/${event.id}`} className="btn btn-grape w-full">
                💬 Open the party chat — meet your Cohost
              </Link>
              <ShareLink
                path={`/e/${event.id}?ref=${user!.id}`}
                label="🔗 Share your invite link — bring someone good"
              />
              <CancelTicketButton ticketId={myTicket.id} eventId={event.id} />
            </div>
          ) : myTicket?.status === "pending" ? (
            <div className="text-center space-y-3">
              <p className="font-semibold">Your seat is on hold.</p>
              <Link href={`/pay/${myTicket.id}`} className="btn btn-primary w-full">
                Complete payment · {formatPrice(
                  event.priceCents > 0
                    ? effectivePriceCents(event, myTicket.kind)
                    : event.depositCents,
                )}
              </Link>
              <CancelTicketButton ticketId={myTicket.id} eventId={event.id} />
            </div>
          ) : myTicket?.status === "waitlisted" ? (
            <div className="text-center space-y-2">
              <p className="text-2xl">⏳</p>
              <p className="font-semibold">You&apos;re on the waitlist.</p>
              <p className="text-sm text-[color:var(--color-ink-soft)]">
                If a seat opens, it&apos;s yours — we&apos;ll notify you instantly.
              </p>
              <CancelTicketButton ticketId={myTicket.id} eventId={event.id} />
            </div>
          ) : user ? (
            <BookForm
              eventId={event.id}
              questions={event.questions ?? []}
              price={formatPrice(event.priceCents)}
              soldOut={soldOut}
              mysterySeatOpen={mysterySeatOpen}
              mysteryPrice={formatPrice(Math.round(event.priceCents * 0.8))}
              duoTickets={event.duoTickets && event.priceCents > 0}
              duoPrice={formatPrice(Math.round(event.priceCents * 0.9) * 2)}
              needsWaiver={event.template === "run_club"}
              depositLabel={
                event.priceCents === 0 && event.depositCents > 0
                  ? formatPrice(event.depositCents)
                  : undefined
              }
            />
          ) : (
            <div className="text-center space-y-3">
              <p className="text-[color:var(--color-ink-soft)]">Sign in to grab a seat — takes 20 seconds.</p>
              <Link href={`/login?next=/e/${event.id}`} className="btn btn-primary w-full">
                Sign in & book · {formatPrice(event.priceCents)}
              </Link>
            </div>
          )}
        </div>

        {show ? (
          <div className="mt-4 text-center">
            <Link
              href={`/show/${show.id}`}
              className="text-sm font-medium text-[color:var(--color-grape)] underline underline-offset-4"
            >
              {show.emoji} Part of {show.title} — see every episode
            </Link>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}
