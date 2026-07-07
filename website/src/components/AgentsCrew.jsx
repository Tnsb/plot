const agents = [
  {
    name: "setup",
    emoji: "⚡",
    vibe: "plans the night",
    desc: "Your text becomes a live page, guest list, and pricing — while you're still at the grocery store.",
    accent: "pink",
  },
  {
    name: "hype",
    emoji: "🔥",
    vibe: "sells it out",
    desc: "Posters, countdowns, waitlist texts. Makes your event feel like something people fight to get into.",
    accent: "gold",
  },
  {
    name: "door",
    emoji: "🚪",
    vibe: "handles money",
    desc: "Checkout, payment reminders, address unlock, group chat. No awkward Venmo requests.",
    accent: "teal",
  },
  {
    name: "afterparty",
    emoji: "🌅",
    vibe: "keeps it going",
    desc: "Feedback, reconnects, rebook nudges. Last month's guests fill next month's table.",
    accent: "ink",
  },
];

export function AgentsCrew() {
  return (
    <section className="agents section" id="agents">
      <div className="section__inner">
        <div className="section__head section__head--center">
          <p className="section__label">your crew</p>
          <h2 className="section__title">
            four agents.
            <span className="section__title-accent"> zero admin.</span>
          </h2>
        </div>

        <div className="agents__grid">
          {agents.map((agent) => (
            <article key={agent.name} className={`agents__card agents__card--${agent.accent}`}>
              <div className="agents__top">
                <span className="agents__emoji" aria-hidden>
                  {agent.emoji}
                </span>
                <div>
                  <h3>{agent.name}</h3>
                  <p className="agents__vibe">{agent.vibe}</p>
                </div>
              </div>
              <p className="agents__desc">{agent.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
