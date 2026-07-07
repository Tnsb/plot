import { useState } from "react";
import { launchCities } from "../data/cities.js";

export function Waitlist() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section className="waitlist section" id="waitlist">
      <div className="section__inner">
        <div className="waitlist__card">
          <div className="waitlist__glow" aria-hidden />
          <div className="waitlist__cities">
            {launchCities.map((city) => (
              <span
                key={city.label}
                className={`waitlist__city${city.status === "first" ? " waitlist__city--first" : ""}`}
              >
                <span aria-hidden>{city.emoji}</span>
                {city.label}
                {city.status === "first" && <small>first</small>}
              </span>
            ))}
          </div>
          <p className="section__label">waitlist</p>
          <h2 className="waitlist__title">
            your next event
            <span className="waitlist__title-accent"> deserves better than a google form</span>
          </h2>
          <p className="waitlist__sub">
            Launching with hosts in New York first — Delhi, India right after. Get on the list wherever
            you&apos;re hosting.
          </p>

          {submitted ? (
            <div className="waitlist__success" role="status">
              <span aria-hidden>✦</span>
              <p className="waitlist__success-title">you&apos;re in. see you at the next one.</p>
            </div>
          ) : (
            <form className="waitlist__form" onSubmit={handleSubmit}>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button type="submit" className="btn btn--primary btn--glow">
                join →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
