/**
 * App shell: minimal dark header + floating glass tab bar on mobile.
 * Server component — reads the session and unread notification count itself.
 */
import Link from "next/link";
import { and, eq, isNull } from "drizzle-orm";
import { db, tables } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { signOutAction } from "@/app/actions";
import { ThemeToggle } from "./theme-toggle";

async function unreadCount(userId: string): Promise<number> {
  const rows = await db
    .select({ id: tables.notifications.id })
    .from(tables.notifications)
    .where(
      and(
        eq(tables.notifications.userId, userId),
        eq(tables.notifications.status, "sent"),
        isNull(tables.notifications.readAt),
      ),
    );
  return rows.length;
}

function TabIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    tonight: <path d="M12 3l2.5 6 6.5.6-5 4.4 1.6 6.5L12 17l-5.6 3.5L8 14 3 9.6 9.5 9z" />,
    cohost: <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" />,
    hosting: (
      <>
        <rect x="4" y="5" width="16" height="16" rx="3" />
        <path d="M8 3v4M16 3v4M4 11h16" />
      </>
    ),
    you: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    inbox: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="M4 6l8 6 8-6" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[21px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

export async function Shell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const unread = user ? await unreadCount(user.id) : 0;

  const tabs = [
    { href: "/", label: "tonight", icon: "tonight" },
    { href: "/host", label: "host", icon: "hosting" },
    { href: "/chat", label: "cohost", icon: "cohost", orb: true },
    { href: "/me", label: "you", icon: "you" },
    { href: "/inbox", label: "after", icon: "inbox", badge: unread },
  ];

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[color:var(--color-cream)]/75 border-b border-[color:var(--hairline)]">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="font-display text-[1.45rem] font-extrabold tracking-tighter lowercase"
          >
            plot<span className="text-[color:var(--color-tangerine)]">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="relative px-3 py-1.5 rounded-full text-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)] hover:bg-[color:var(--color-card-2)] transition-colors"
              >
                {t.label}
                {t.badge ? (
                  <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[color:var(--color-tangerine)] text-white text-[10px] font-bold flex items-center justify-center">
                    {t.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <form action={signOutAction} className="flex items-center gap-2">
                <span className="hidden sm:block text-sm text-[color:var(--color-ink-soft)] max-w-32 truncate">
                  {user.name ?? user.email}
                </span>
                <button className="btn btn-ghost !py-1.5 !px-3 !text-xs" type="submit">
                  Sign out
                </button>
              </form>
            ) : (
              <Link href="/login" className="btn btn-ink !py-1.5 !px-4 !text-sm">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-28 md:pb-10">{children}</main>

      {/* mobile: floating glass dock — the cohost rides in the middle as an orb */}
      <nav className="md:hidden fixed bottom-3.5 inset-x-3.5 z-40 glass rounded-[30px] shadow-[var(--shadow-warm-lg)] mb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 p-[7px] items-end">
          {tabs.map((t) =>
            t.orb ? (
              <Link
                key={t.href}
                href={t.href}
                aria-label="cohost"
                className="relative flex flex-col items-center -mt-7"
              >
                <span className="size-14 rounded-full grid place-items-center text-white bg-gradient-to-br from-[color:var(--color-raspberry)] to-[color:var(--color-tangerine)] border-[3px] border-[color:var(--color-card)] shadow-[0_10px_28px_rgba(204,23,87,0.45)] active:scale-95 transition-transform">
                  <TabIcon name={t.icon} />
                </span>
                <span className="text-[10px] font-semibold lowercase mt-1 text-[color:var(--color-tangerine)]">
                  {t.label}
                </span>
              </Link>
            ) : (
              <Link
                key={t.href}
                href={t.href}
                className="relative flex flex-col items-center gap-[3px] py-2 rounded-3xl text-[color:var(--color-ink-faint)] active:text-[color:var(--color-ink)] active:bg-[color:var(--color-ink)]/8 transition-colors"
              >
                <TabIcon name={t.icon} />
                <span className="text-[10px] font-semibold lowercase">{t.label}</span>
                {t.badge ? (
                  <span className="absolute top-0.5 right-[18%] min-w-4 h-4 px-1 rounded-full bg-[color:var(--color-tangerine)] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_12px_rgba(204,23,87,0.55)]">
                    {t.badge}
                  </span>
                ) : null}
              </Link>
            ),
          )}
        </div>
      </nav>
    </div>
  );
}
