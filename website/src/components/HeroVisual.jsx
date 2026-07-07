export function HeroVisual() {
  return (
    <div className="ui-card" aria-hidden>
      <div className="ui-card__aura" />
      <article className="ui-card__panel">
        <header className="ui-card__head">
          <span className="ui-card__status">
            <span className="ui-card__dot" />
            live
          </span>
          <span className="ui-card__time">thu · 8pm</span>
        </header>

        <h3 className="ui-card__title">your event</h3>
        <p className="ui-card__line">8 seats · $45 · address locked</p>

        <div className="ui-card__track" role="presentation">
          <span className="ui-card__fill" />
        </div>

        <footer className="ui-card__foot">
          <div className="ui-card__faces">
            <span />
            <span />
            <span />
            <em>+5</em>
          </div>
          <span className="ui-card__tag">6 paid</span>
        </footer>
      </article>
    </div>
  );
}
