import { importantDates } from "../../fakeDatas";
import { Calendar } from "lucide-react";

export default function ImportantDates() {
  return (
    <section>
      <Calendar
        className="section-icon"
        color="#eb4c4c"
        strokeWidth={5}
        size={100}
        absoluteStrokeWidth
      />
      <div className="section-content">
        <h2 className="primary">Important Dates</h2>
        <ul>
          <li>
            Initial submission due :{" "}
            <span className="important-info">
              {importantDates.initialSubmissionDue.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
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
                  year: "numeric",
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
                year: "numeric",
              })}
            </span>
          </li>
          <li>
            Registration :{" "}
            <span className="important-info">
              {importantDates.registration.toLocaleDateString("en-US", {
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
  );
}
