import "./Header.css";
import NavBar from "../NavBar/NavBar";
import { useState } from "react";
import DisplayNews from "../DisplayNews/DisplayNews";
import { AnimatePresence } from "framer-motion";

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

  const [displayNews, setDisplayNews] = useState(true);

  return (
    <header>
      <NavBar data={data.conferenceData} />
      {banner && (
        <div
          className="page-title"
          style={{
            backgroundImage: `url(${
              import.meta.env.VITE_IMAGE_URL + "/" + data.conferenceData.banner
            })`,
          }}
        >
          <h1>
            {data.conferenceData.acronym + " " + data.conferenceData.year}
          </h1>
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
            , {data.conferenceData.year} in {data.conferenceData.city},{" "}
            {data.conferenceData.country}.
          </p>
        </div>
      )}
      <AnimatePresence>
        {displayNews ? (
          <DisplayNews
            news={data.newsData}
            close={() => setDisplayNews(false)}
          />
        ) : null}
      </AnimatePresence>
    </header>
  );
}
