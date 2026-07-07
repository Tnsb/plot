import { useState } from "react";

const moments = [
  {
    id: "pay",
    text: "you're still chasing payments in venmo / cash app",
  },
  {
    id: "addr",
    text: "the address went out before everyone actually paid",
  },
  {
    id: "poster",
    text: "your poster is still a canva tab you haven't finished",
  },
  {
    id: "chat",
    text: "the group chat is 200 messages of 'what time again?'",
  },
  {
    id: "after",
    text: "last time was great — and you have zero follow-up plan",
  },
];

export function HostChecklist() {
  const [checked, setChecked] = useState([]);

  const toggle = (id) => {
    setChecked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const hitCount = checked.length;

  return (
    <section className="moment section" id="moment">
      <div className="section__inner moment__inner">
        <div className="moment__head">
          <p className="section__label">hosting something soon?</p>
          <h2 className="section__title">
            sound familiar?
            <span className="section__title-accent"> tap what happened at your last event</span>
          </h2>
        </div>

        <ul className="moment__list">
          {moments.map((item) => {
            const isOn = checked.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`moment__item${isOn ? " moment__item--on" : ""}`}
                  onClick={() => toggle(item.id)}
                  aria-pressed={isOn}
                >
                  <span className="moment__check" aria-hidden>
                    {isOn ? "✓" : ""}
                  </span>
                  <span className="moment__text">{item.text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="moment__punch">
          {hitCount >= 2 ? (
            <>
              <p className="moment__punch-line">
                okay yeah — you need this for your <em>next</em> one.
              </p>
              <a className="btn btn--primary btn--glow" href="#waitlist">
                save me a spot ✦
              </a>
            </>
          ) : (
            <p className="moment__hint">tap what sounds like your last event 👆</p>
          )}
        </div>
      </div>
    </section>
  );
}
