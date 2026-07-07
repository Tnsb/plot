import { verticals } from "../data/verticals.js";

export function PopUpRooms() {
  return (
    <section className="rooms section" id="rooms">
      <div className="section__inner rooms__compact">
        <p className="section__label">works for</p>
        <h2 className="section__title section__title--inline">
          whatever you&apos;re hosting next
          <span className="section__title-accent"> — same app, every room</span>
        </h2>

        <div className="rooms__cloud">
          {verticals.map((room) => (
            <span key={room.label} className="rooms__pill">
              <span aria-hidden>{room.emoji}</span>
              {room.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
