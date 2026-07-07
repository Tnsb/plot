const features = [
  {
    size: "large",
    tone: "pink",
    icon: "🎨",
    title: "poster drops",
    body: "Four gorgeous styles — film grain, Y2K, editorial, zine — sized for story and TikTok. Your friends will ask who designed it.",
    tag: "before",
  },
  {
    size: "medium",
    tone: "gold",
    icon: "⏳",
    title: "drop-style tickets",
    body: "Countdown, waitlist, early access for past guests. Feels exclusive. Sells out faster.",
    tag: "hype",
  },
  {
    size: "medium",
    tone: "lavender",
    icon: "🎭",
    title: "mystery seats",
    body: "One blind ticket — unknown menu, unknown tablemates. For the adventurous ones.",
    tag: "fun",
  },
  {
    size: "medium",
    tone: "cream",
    icon: "💬",
    title: "group chat included",
    body: "Pay and you're in. Playlist, dress code, address unlock, icebreakers — all automatic.",
    tag: "night of",
  },
  {
    size: "large",
    tone: "ink",
    icon: "✨",
    title: "afterparty",
    body: "Recap reel, reconnect taps, easy rebooking. The night doesn't end when everyone leaves.",
    tag: "after",
  },
];

export function BentoFeatures() {
  return (
    <section className="bento section" id="features">
      <div className="section__inner">
        <div className="section__head section__head--center">
          <p className="section__label">what you get</p>
          <h2 className="section__title">
            nights people
            <span className="section__title-accent"> actually talk about</span>
          </h2>
        </div>

        <div className="bento__grid bento__grid--compact">
          {features.map((f) => (
            <article key={f.title} className={`bento__card bento__card--${f.size} bento__card--${f.tone}`}>
              <span className="bento__tag">{f.tag}</span>
              <span className="bento__icon" aria-hidden>
                {f.icon}
              </span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
