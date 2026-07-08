/**
 * /me — the profile as receipts. Not a feed: proof of nights out.
 * Rendered as a season pass: your show, your stats, your shelf.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "@/components/shell";
import { getCurrentUser } from "@/lib/auth";
import { runTool } from "@/agent/registry";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";

type Profile = {
  name: string | null;
  settings: { igHandle: string | null; shareHandleOnMatch: boolean };
  receipts: {
    episodesThisYear: number;
    episodesAllTime: number;
    charactersMet: number;
    superlativeShelf: { category: string; eventTitle: string }[];
    mainCast: string[];
    shows: { id: string; title: string; season: number; url: string }[];
  };
};

export default async function MePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/me");

  const res = await runTool(
    "get_my_profile",
    { userId: user.id, name: user.name ?? user.email, isSystem: false },
    {},
  );
  if (!res.ok) redirect("/");
  const profile = res.data as Profile;
  const r = profile.receipts;
  const year = new Date().getFullYear();

  return (
    <Shell>
      <div className="mx-auto max-w-2xl px-4 py-7 space-y-5">
        <header className="rise-in">
          <p className="kicker">season {year} · your receipts</p>
          <h1 className="hed text-4xl lowercase mt-3">
            main character <em className="hed-glow">energy.</em>
          </h1>
        </header>

        {/* the season pass — the stat card that IS the profile */}
        <section className="relative overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--color-card-2)] p-6">
          {/* ticket gradient strip */}
          <span
            aria-hidden
            className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[color:var(--color-tangerine)] via-[color:var(--color-grape)] to-[color:var(--color-butter)]"
          />
          <span aria-hidden className="absolute -right-6 -top-8 text-[7rem] opacity-10 rotate-12 select-none">🎬</span>

          <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[color:var(--color-ink-faint)]">
            {profile.name ?? "you"} · the show
          </p>
          <div className="grid grid-cols-3 gap-4 text-center mt-5">
            <div>
              <p className="hed text-5xl tabular-nums">{r.episodesThisYear}</p>
              <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[color:var(--color-ink-faint)] mt-2">episodes<br />this year</p>
            </div>
            <div>
              <p className="hed text-5xl tabular-nums text-[color:var(--color-tangerine)]">{r.charactersMet}</p>
              <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[color:var(--color-ink-faint)] mt-2">characters<br />met</p>
            </div>
            <div>
              <p className="hed text-5xl tabular-nums">{r.shows.length}</p>
              <p className="font-mono text-[0.58rem] font-bold uppercase tracking-[0.12em] text-[color:var(--color-ink-faint)] mt-2">shows<br />running</p>
            </div>
          </div>
          <p className="mt-6 pt-4 border-t border-dashed border-[color:var(--hairline-strong)] font-mono text-[0.62rem] text-[color:var(--color-ink-faint)] text-center tracking-[0.06em]">
            {r.episodesAllTime} EPISODES ALL TIME · PROOF OF A LIFE, NOT A FEED
          </p>
        </section>

        {/* superlative shelf */}
        {r.superlativeShelf.length > 0 ? (
          <section className="card p-5">
            <h2 className="hed text-lg lowercase mb-3">🏆 the shelf</h2>
            <div className="flex flex-wrap gap-1.5">
              {r.superlativeShelf.map((w, i) => (
                <span key={i} className="pill bg-[color:var(--color-butter-soft)] text-[color:var(--color-butter)] !text-xs" title={w.eventTitle}>
                  {w.category}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {/* main cast */}
        {r.mainCast.length > 0 ? (
          <section className="card p-5">
            <h2 className="hed text-lg lowercase mb-1.5">🎭 your main cast</h2>
            <p className="text-xs text-[color:var(--color-ink-faint)] mb-3">
              The people who keep showing up in your episodes.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {r.mainCast.map((name) => (
                <span key={name} className="pill bg-[color:var(--color-card-2)] border border-[color:var(--hairline)]">{name}</span>
              ))}
            </div>
          </section>
        ) : null}

        {/* shows */}
        {r.shows.length > 0 ? (
          <section className="card p-5">
            <h2 className="hed text-lg lowercase mb-3">📺 your shows</h2>
            <ul className="space-y-2.5">
              {r.shows.map((s) => (
                <li key={s.id}>
                  <Link href={s.url} className="flex items-center justify-between text-sm group">
                    <span className="font-semibold group-hover:text-[color:var(--color-tangerine-deep)] transition-colors">{s.title}</span>
                    <span className="font-mono text-xs text-[color:var(--color-ink-faint)]">s{s.season} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* connections shortcut */}
        <Link href="/inbox" className="btn btn-ghost w-full">
          💌 Notifications & matches live in your inbox
        </Link>

        {/* settings */}
        <section className="card p-5">
          <h2 className="hed text-lg lowercase mb-3">settings</h2>
          <SettingsForm
            initialIgHandle={profile.settings.igHandle}
            initialShare={profile.settings.shareHandleOnMatch}
          />
        </section>
      </div>
    </Shell>
  );
}
