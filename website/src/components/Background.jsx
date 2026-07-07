export function Background() {
  return (
    <>
      <div className="bg-tunnel" aria-hidden>
        <div className="bg-tunnel__scene">
          <div className="bg-tunnel__plane bg-tunnel__plane--floor" />
          <div className="bg-tunnel__plane bg-tunnel__plane--ceiling" />
          <div className="bg-tunnel__plane bg-tunnel__plane--left" />
          <div className="bg-tunnel__plane bg-tunnel__plane--right" />
        </div>
      </div>
      <div className="bg-mesh" aria-hidden />
      <div className="bg-orbs" aria-hidden>
        <span className="bg-orb bg-orb--pink" />
        <span className="bg-orb bg-orb--gold" />
        <span className="bg-orb bg-orb--lavender" />
      </div>
    </>
  );
}
