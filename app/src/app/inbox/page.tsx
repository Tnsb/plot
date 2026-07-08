import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db, tables } from "@/db";
import { Shell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import { markNotificationsReadAction } from "@/app/actions";

export const dynamic = "force-dynamic";

const ICONS: Record<string, string> = {
  "ticket.confirmed": "🎟️",
  "host.seat_sold": "💸",
  "host.sold_out": "🔥",
  "waitlist.promoted": "🪑",
  "afterparty.feedback_request": "✨",
  "host.feedback": "⭐",
  "event.reminder": "🗓",
};

export default async function InboxPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/inbox");

  const items = await db
    .select()
    .from(tables.notifications)
    .where(eq(tables.notifications.userId, user.id))
    .orderBy(desc(tables.notifications.createdAt))
    .limit(50);

  const visible = items.filter((n) => n.status === "sent");
  const unreadCount = visible.filter((n) => !n.readAt).length;

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-7">
        <div className="flex items-end justify-between mb-6 rise-in">
          <div>
            <p className="kicker">
              {unreadCount > 0 ? `${unreadCount} unread` : "all caught up"}
            </p>
            <h1 className="hed text-4xl lowercase mt-3">
              the <em>morning after.</em>
            </h1>
          </div>
          {unreadCount > 0 ? (
            <form action={markNotificationsReadAction}>
              <button className="btn btn-ghost !py-1.5 !px-3 !text-xs" type="submit">
                Mark all read
              </button>
            </form>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-4xl mb-3">📮</p>
            <p className="hed text-2xl lowercase">nothing yet</p>
            <p className="text-[color:var(--color-ink-soft)] mt-1">
              Confirmations, reminders and AfterParty asks land here.
            </p>
          </div>
        ) : (
          /* timeline, not a card stack — receipts read top to bottom */
          <ul className="card divide-y divide-[color:var(--hairline)] overflow-hidden">
            {visible.map((n) => {
              const inner = (
                <div
                  className={`flex gap-3.5 items-start px-4 py-4 transition-colors ${
                    n.href ? "hover:bg-[color:var(--color-card-2)]" : ""
                  } ${n.readAt ? "opacity-70" : ""}`}
                >
                  <span className="relative text-lg leading-none mt-0.5">
                    {ICONS[n.templateKey] ?? "▤"}
                    {!n.readAt ? (
                      <span className="absolute -top-1 -right-1.5 size-2 rounded-full bg-[color:var(--color-tangerine)] shadow-[0_0_8px_rgba(255,45,85,0.7)]" />
                    ) : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-semibold text-sm leading-snug">{n.title}</p>
                      <p className="font-mono text-[0.6rem] text-[color:var(--color-ink-faint)] whitespace-nowrap tabular-nums uppercase">
                        {n.sentAt?.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <p className="text-sm text-[color:var(--color-ink-soft)] mt-0.5">{n.body}</p>
                  </div>
                </div>
              );
              return <li key={n.id}>{n.href ? <Link href={n.href}>{inner}</Link> : inner}</li>;
            })}
          </ul>
        )}
      </div>
    </Shell>
  );
}
