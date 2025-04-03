import "./Header.css";
import morocco from "../../assets/images/morocco.jpg";
import NavBar from "../NavBar/NavBar";

export default function Header({ banner = false, data }) {
  const convertedDates = {
    initial_submission_due: new Date(
      data.importantDatesData.initial_submission_due
    ),
    paper_decision_notification: new Date(
      data.importantDatesData.paper_decision_notification
    ),
    final_submission_due: new Date(
      data.importantDatesData.final_submission_due
    ),
    registration: new Date(data.importantDatesData.registration),
    congress_opening: new Date(data.importantDatesData.congress_opening),
    congress_closing: new Date(data.importantDatesData.congress_closing),
  };

  return (
    <header>
      <NavBar data={data.conferenceData} />
      {banner && (
        <div
          className="page-title"
          style={{ backgroundImage: `url(${morocco})` }}
        >
          <h1>ICSC 2025</h1>
          <p>
            {convertedDates.congress_opening.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
            })}{" "}
            to{" "}
            {convertedDates.congress_closing.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            , 2025 in {data.conferenceData.city}, {data.conferenceData.country}.
          </p>
        </div>
      )}
    </header>
  );
}
