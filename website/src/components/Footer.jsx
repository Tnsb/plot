import { brand } from "../data/brand.js";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__logo">{brand.name} ✦</span>
        <div className="footer__links">
          <a href="#agents">agents</a>
          <a href="#features">features</a>
          <a href="#waitlist">waitlist</a>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} {brand.name}</p>
      </div>
    </footer>
  );
}
