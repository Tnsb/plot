import { FilmGrain } from "./components/FilmGrain.jsx";
import { Background } from "./components/Background.jsx";
import { PointerGlow } from "./components/PointerGlow.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Hero } from "./components/Hero.jsx";
import { HostChecklist } from "./components/HostChecklist.jsx";
import { AgentsCrew } from "./components/AgentsCrew.jsx";
import { BentoFeatures } from "./components/BentoFeatures.jsx";
import { PopUpRooms } from "./components/PopUpRooms.jsx";
import { Waitlist } from "./components/Waitlist.jsx";
import { Footer } from "./components/Footer.jsx";

export function App() {
  return (
    <>
      <Background />
      <PointerGlow />
      <FilmGrain />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="site-shell">
        <Navbar />
        <main id="main">
          <Hero />
          <HostChecklist />
          <AgentsCrew />
          <BentoFeatures />
          <PopUpRooms />
          <Waitlist />
        </main>
        <Footer />
      </div>
    </>
  );
}
