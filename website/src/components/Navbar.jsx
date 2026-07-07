import { brand } from "../data/brand.js";

export function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <a className="nav__logo" href="#">
          <span className="nav__logo-mark" aria-hidden>
            ✦
          </span>
          {brand.name}
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#moment">is this me?</a>
          <a href="#agents">agents</a>
          <a href="#features">features</a>
          <a href="#waitlist" className="nav__cta">
            join
          </a>
        </nav>
      </div>
    </header>
  );
}
