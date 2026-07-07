import { HeroVisual } from "./HeroVisual.jsx";
import { launchLine } from "../data/cities.js";
import { brand } from "../data/brand.js";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span className="pill pill--sparkle">{launchLine}</span>
            <span className="hero__script">{brand.hook}</span>
          </p>

          <h1 className="hero__title">
            <span className="hero__title-line">host the night.</span>
            <span className="hero__title-line hero__title-line--accent">
              not the <em>spreadsheet</em>
            </span>
          </h1>

          <p className="hero__lede">
            Tell {brand.name} what you&apos;re throwing — one lil sentence. It builds your page, drops posters, collects
            payment, spawns the group chat, and follows up after. You just show up.
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary btn--glow" href="#waitlist">
              join waitlist ✦
            </a>
            <a className="btn btn--ghost" href="#moment">
              is this me?
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
