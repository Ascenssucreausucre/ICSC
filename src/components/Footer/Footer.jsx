import "./Footer.css";
import { useState, useEffect } from "react";

export default function Footer({ data }) {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  const UPLOADS_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const types = data.reduce((acc, sponsor) => {
      const { type, ...formattedSponsor } = sponsor;

      if (!acc.find((item) => item.type === sponsor.type)) {
        acc.push({ type: sponsor.type, list: [] });
      }

      acc
        .find((item) => item.type === sponsor.type)
        .list.push(formattedSponsor);

      return acc;
    }, []);

    setSponsors(types);
    setLoading(false);
  }, [data]); // exécute uniquement quand `data` change

  return (
    <footer>
      {!loading &&
        sponsors.map(
          (sponsor) =>
            sponsor.list.length > 0 && (
              <div key={sponsor.type} className="sponsor-type">
                <h2 className="title">{sponsor.type}</h2>
                <div className="sponsors">
                  {sponsor.list.map((item) => (
                    <div className="sponsor" key={item.id}>
                      <img src={UPLOADS_URL + item.image} alt="" />
                      <p key={item.name}>{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
    </footer>
  );
}
