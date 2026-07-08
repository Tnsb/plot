/**
 * The plot backdrop — a big, unmissable world behind every screen.
 * Graph-paper grid (the plot, literally) with hot-pink accent lines,
 * a 3D grid floor rushing toward you, huge drifting color orbs,
 * projector beam + dust + sprockets, a ghosted season mark, and a
 * lamp spotlight that follows the cursor.
 * Mostly CSS; a tiny inline script tracks the pointer. See globals.css `.reel`.
 */
export function Backdrop() {
  return (
    <>
      <div className="reel" aria-hidden>
        <div className="reel__grid" />
        <div className="reel__scene">
          <div className="reel__floor" />
        </div>
        <div className="reel__blob reel__blob--a" />
        <div className="reel__blob reel__blob--b" />
        <div className="reel__blob reel__blob--c" />
        <div className="reel__beam" />
        <div className="reel__spot" id="reel-spot" />
        <div className="reel__dust reel__dust--a" />
        <div className="reel__dust reel__dust--b" />
        <div className="reel__sprockets reel__sprockets--l" />
        <div className="reel__sprockets reel__sprockets--r" />
        <span className="reel__mark">s01</span>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var s=document.getElementById("reel-spot");if(!s||window.matchMedia("(pointer: coarse)").matches)return;var rx=50,ry=12,tx=50,ty=12,raf;function loop(){rx+=(tx-rx)*0.12;ry+=(ty-ry)*0.12;s.style.setProperty("--mx",rx.toFixed(1)+"%");s.style.setProperty("--my",ry.toFixed(1)+"%");if(Math.abs(tx-rx)>0.1||Math.abs(ty-ry)>0.1){raf=requestAnimationFrame(loop)}else{raf=null}}window.addEventListener("pointermove",function(e){tx=e.clientX/window.innerWidth*100;ty=e.clientY/window.innerHeight*100;if(!raf)raf=requestAnimationFrame(loop)},{passive:true})})()`,
        }}
      />
    </>
  );
}
