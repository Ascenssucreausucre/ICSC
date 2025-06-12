import { Mail } from "lucide-react";
import "./Footer.css";
import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";

export default function Footer({ data }) {
  const [sponsors, setSponsors] = useState([]);
  const {
    conferenceData: conference,
    contacts,
    importantDatesData: dates,
  } = data;
  const [loading, setLoading] = useState(true);

  const UPLOADS_URL = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    const { sponsors } = data;
    const types = sponsors.reduce((acc, sponsor) => {
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
  }, [data]);

  return (
    <footer>
      <section className="footer-top">
        <div className="contact-container">
          {!loading &&
            contacts.map((contact, idx) => (
              <div className="contact" key={idx}>
                <h4>
                  {contact.name +
                    " " +
                    contact.surname +
                    (contact?.role ? " - " + contact.role : "")}
                </h4>
                <a href={`mailto:${contact.email}`} className="link">
                  <Mail strokeWidth={3} />
                  {contact.email}
                </a>
                <a href={`tel:${contact.tel}`} className="link">
                  <Phone strokeWidth={3} />
                  {contact.tel}
                </a>
              </div>
            ))}
        </div>
        <div className="sponsor-container">
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
        </div>
      </section>

      {/* Example of future social media integration
      <section className="footer-social">
        <p>
          Follow us:
          <a
            href="https://twitter.com/YourConference"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Twitter
          </a>{" "}
          |{" "}
          <a
            href="https://linkedin.com/company/YourConference"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            LinkedIn
          </a>{" "}
          |{" "}
          <a
            href="https://instagram.com/YourConference"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Instagram
          </a>
        </p>
      </section> */}

      <section className="footer-bottom">
        <div className="footer-links">
          <nav>
            <a href="/terms" className="link">
              Terms & Conditions
            </a>
            <a href="/privacy" className="link">
              Privacy Policy
            </a>
            <a href="/cookies" className="link">
              Cookies Policy
            </a>
          </nav>
        </div>
        <p>
          © {conference.year} International Conference on Systems and Controls
          (ICSC) - Website realised by{" "}
          <a
            href="https://amiotflorian.alwaysdata.net/Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            Florian Amiot
          </a>
        </p>
        <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
          This site uses cookies necessary for its operation, including
          authentication cookies. No personal data is tracked without your
          consent.
        </p>
      </section>
    </footer>
  );
}
