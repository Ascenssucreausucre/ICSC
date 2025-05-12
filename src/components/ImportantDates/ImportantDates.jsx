import { Calendar } from "lucide-react";

export default function ImportantDates({ data }) {
  return (
    <section className="important-dates">
      <Calendar
        className="section-icon"
        color={getComputedStyle(document.documentElement).getPropertyValue(
          "--primary-color"
        )}
        strokeWidth={5}
        size={100}
        absoluteStrokeWidth
      />
      {data ? (
        <div className="section-content">
          <h2 className="primary">Important Dates</h2>
          <ul>
            <li>
              Initial submission due :{" "}
              <span className="important-info">
                {new Date(data.initial_submission_due).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}{" "}
              </span>
            </li>
            <li>
              Paper decision notification :{" "}
              <span className="important-info">
                {data.paper_decision_notification.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </li>
            <li>
              Final submission due :{" "}
              <span className="important-info">
                {data.final_submission_due.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </li>
            <li>
              Registration :{" "}
              <span className="important-info">
                {data.registration.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </li>
            <li>
              Congress :{" "}
              <span className="important-info">
                from{" "}
                {data.congress_opening.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                })}{" "}
                to{" "}
                {data.congress_closing.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
              </span>
            </li>
          </ul>
        </div>
      ) : (
        <p>This conference has no important dates yet</p>
      )}
    </section>
  );
}
