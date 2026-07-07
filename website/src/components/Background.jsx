export function Background() {
  return (
    <>
      <div className="bg-graph" aria-hidden>
        <span className="bg-graph__axis bg-graph__axis--x" />
        <span className="bg-graph__axis bg-graph__axis--y" />
      </div>
      <div className="bg-mesh" aria-hidden />
      <div className="bg-orbs" aria-hidden>
        <span className="bg-orb bg-orb--pink" />
        <span className="bg-orb bg-orb--gold" />
        <span className="bg-orb bg-orb--lavender" />
      </div>
      <div className="bg-sparkles" aria-hidden>
        <span>✦</span>
        <span>✦</span>
        <span>✦</span>
      </div>
    </>
  );
}
