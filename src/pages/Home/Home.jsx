import "./Home.css";
import { Calendar } from "lucide-react";
export default function Home() {
  const globalInfos = {
    city: "Marrakesh",
    country: "Morocco",
    year: "2025",
  };
  const importantDates = {
    initialSubmissionDue: new Date("2025-06-15T10:00:00"),
    paperDecisionNotification: new Date("2025-07-25T10:00:00"),
    finalSubmissionDue: new Date("2025-09-10T10:00:00"),
    registration: new Date("2025-10-15T10:00:00"),
    congress: {
      opening: new Date("2025-10-22T00:00:00"),
      closing: new Date("2025-10-24T00:00:00"),
    },
  };

  return (
    <>
      <h1>ICSC 2025</h1>
      <section>
        <h2>Invitation</h2>
        <p>
          It is our great pleasure to invite you to participate in the IEEE 2025
          13th International Conference on Systems and Control (ICSC'
          {globalInfos.year}) Following the previous editions, the 13th edition
          of the International Conference on Systems and Control will be held
          from{" "}
          <span className="important-info">
            {" "}
            {importantDates.congress.opening.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
            })}{" "}
            to{" "}
            {importantDates.congress.closing.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            , 2025 in {globalInfos.city}, {globalInfos.country}.
          </span>
        </p>
      </section>
      <section>
        <Calendar
          className="section-icon"
          color="#405ef2"
          strokeWidth={1.5}
          absoluteStrokeWidth
        />
        <div className="section-content">
          <h2>Important Dates</h2>
          <ul>
            <li>
              Initial submission due :{" "}
              <span className="important-info">
                {importantDates.initialSubmissionDue.toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                  }
                )}{" "}
              </span>
            </li>
            <li>
              Paper decision notification :{" "}
              <span className="important-info">
                {importantDates.paperDecisionNotification.toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                  }
                )}
              </span>
            </li>
            <li>
              Final submission due :{" "}
              <span className="important-info">
                {importantDates.finalSubmissionDue.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </li>
            <li>
              Registration :{" "}
              <span className="important-info">
                {importantDates.registration.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </li>
            <li>
              Congress :{" "}
              <span className="important-info">
                from{" "}
                {importantDates.congress.opening.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                to{" "}
                {importantDates.congress.closing.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
              </span>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
