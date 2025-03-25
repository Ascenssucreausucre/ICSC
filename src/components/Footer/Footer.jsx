import "./Footer.css";
import { sponsors } from "../../fakeDatas";

export default function Footer() {
  return (
    <footer>
      {sponsors.map(
        (sponsor) =>
          sponsor.list.length > 0 && (
            <div key={sponsor.type} className="sponsor-type">
              <h2 className="title">{sponsor.type}</h2>
              <div className="sponsors">
                {sponsor.list.map((item) => (
                  <p key={item.name}>{item.name}</p>
                ))}
              </div>
            </div>
          )
      )}
    </footer>
  );
}
