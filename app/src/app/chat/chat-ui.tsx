"use client";

/**
 * The agent chat surface. Talks to /api/chat, which runs the SAME tool
 * registry the buttons use. Tool calls render as small chips so you can see
 * the crew working.
 */
import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";

const SUGGESTIONS_HOST = [
  "murder mystery dinner saturday, 12 seats, $45",
  "who's coming to my night?",
  "what's happening this week?",
  "how did my last episode go?",
];

const SUGGESTIONS_GUEST = ["what's happening this week?", "what am I going to?"];

/** minimal markdown: **bold**, [links](…), bullet lines, line breaks */
function renderText(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {renderInline(line)}
    </Fragment>
  ));
}

function renderInline(line: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index));
    if (m[1]) out.push(<strong key={key++}>{m[1]}</strong>);
    else
      out.push(
        <Link key={key++} href={m[3]} className="underline underline-offset-2 font-semibold text-[color:var(--color-tangerine-deep)]">
          {m[2]}
        </Link>,
      );
    last = re.lastIndex;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

function toolName(partType: string, part: { toolName?: string }): string {
  if (part.toolName) return part.toolName;
  return partType.replace(/^tool-/, "");
}

export function ChatUI({ isSignedIn, isHost }: { isSignedIn: boolean; isHost: boolean }) {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setInput("");
    void sendMessage({ text: t });
  }

  const suggestions = isHost || !isSignedIn ? SUGGESTIONS_HOST : SUGGESTIONS_GUEST;

  return (
    <div className="flex flex-col h-[calc(100dvh-3.5rem-1px)] md:h-[calc(100dvh-3.5rem-1px)]">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6 space-y-4 pb-44">
          {messages.length === 0 ? (
            <div className="pt-10 rise-in">
              <p className="kicker">cohost · online</p>
              <h1 className="hed text-4xl lowercase mt-3">
                tell me the <em>plot.</em>
              </h1>
              <p className="text-[color:var(--color-ink-soft)] mt-3 max-w-sm">
                One sentence becomes a live, bookable night — page, poster, group chat, payments,
                the morning-after Reveal. All of it.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    className="px-4 py-2.5 rounded-full text-sm font-medium text-left border border-[color:var(--hairline-strong)] hover:border-[color:var(--color-tangerine)] hover:bg-[color:var(--color-blush)] transition-colors cursor-pointer"
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!isSignedIn ? (
                <p className="text-sm text-[color:var(--color-ink-soft)] mt-6">
                  <Link href="/login?next=/chat" className="font-semibold underline underline-offset-2">
                    Sign in
                  </Link>{" "}
                  to host or book through your Cohost.
                </p>
              ) : null}
            </div>
          ) : null}

          {messages.map((message) => (
            <div key={message.id} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  message.role === "user"
                    ? "max-w-[85%] rounded-3xl rounded-br-md bg-[color:var(--color-ink)] text-[color:var(--color-cream)] px-4 py-2.5 text-[15px] leading-relaxed font-medium"
                    : "max-w-[85%] space-y-2"
                }
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return message.role === "user" ? (
                      <span key={i}>{part.text}</span>
                    ) : (
                      <div
                        key={i}
                        className="card rounded-3xl rounded-bl-md px-4 py-2.5 text-[15px] leading-relaxed"
                      >
                        {renderText(part.text)}
                      </div>
                    );
                  }
                  if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
                    const p = part as { type: string; toolName?: string; state?: string };
                    return (
                      <div key={i} className="pill bg-[color:var(--color-grape-soft)] text-[color:var(--color-grape)] font-mono !text-xs">
                        ⚙ {toolName(p.type, p)}
                        {p.state && !String(p.state).includes("output") ? "…" : " ✓"}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}

          {busy && messages[messages.length - 1]?.role === "user" ? (
            <div className="flex justify-start">
              <div className="card rounded-3xl rounded-bl-md px-4 py-3 flex gap-1.5">
                <span className="typing-dot size-1.5 rounded-full bg-[color:var(--color-ink-soft)]" />
                <span className="typing-dot size-1.5 rounded-full bg-[color:var(--color-ink-soft)]" />
                <span className="typing-dot size-1.5 rounded-full bg-[color:var(--color-ink-soft)]" />
              </div>
            </div>
          ) : null}

          {status === "error" ? (
            <p className="text-sm text-center text-[color:var(--color-tangerine-deep)] font-medium">
              Your Cohost dropped the aux — try sending that again.
            </p>
          ) : null}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="fixed bottom-[calc(4.6rem+env(safe-area-inset-bottom))] md:bottom-0 inset-x-0 bg-gradient-to-t from-[color:var(--color-cream)] via-[color:var(--color-cream)]/95 to-transparent pt-6 pb-3">
        <form
          className="mx-auto max-w-2xl px-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            className="field !rounded-full !py-3 !bg-[color:var(--color-card)]"
            placeholder='try: "pasta night friday, 8 seats, $40"'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
          />
          <button className="btn btn-primary !px-5" disabled={busy || !input.trim()} type="submit">
            ↑
          </button>
        </form>
      </div>
    </div>
  );
}
