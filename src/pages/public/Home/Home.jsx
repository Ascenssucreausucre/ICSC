import CustomDetails from "../../../components/CustomDetails/CustomDetails";
import "./Home.css";
import ImportantDates from "../../../components/ImportantDates/ImportantDates";
import { useLoaderData } from "react-router-dom";
export default function Home() {
  const homePageData = useLoaderData();
  const convertedDates = {
    initial_submission_due: new Date(
      homePageData.importantDatesData.initial_submission_due
    ),
    paper_decision_notification: new Date(
      homePageData.importantDatesData.paper_decision_notification
    ),
    final_submission_due: new Date(
      homePageData.importantDatesData.final_submission_due
    ),
    registration: new Date(homePageData.importantDatesData.registration),
    congress_opening: new Date(
      homePageData.importantDatesData.congress_opening
    ),
    congress_closing: new Date(
      homePageData.importantDatesData.congress_closing
    ),
  };

  return (
    <>
      <section>
        <h2 className="title primary">Invitation</h2>
        <p>
          It is our great pleasure to invite you to participate in the IEEE
          {" " + homePageData.conferenceData.year + " "}
          {homePageData.conferenceData.conference_index}th International
          Conference on Systems and Control (
          {homePageData.conferenceData.acronym}'
          {homePageData.conferenceData.year}) Following the previous editions,
          the {homePageData.conferenceData.conference_index}th edition of the
          International Conference on Systems and Control will be held from{" "}
          <span className="important-info">
            {" "}
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
            , 2025 in {homePageData.conferenceData.city},{" "}
            {homePageData.conferenceData.country}.
          </span>
        </p>
      </section>
      <ImportantDates data={convertedDates} />
      <section className="topics">
        <h2 className="title primary">Topics of interest</h2>
        <p>
          This edition's main topics are written down below. Have in mind that
          the conference will treat more topics than just the main ones.
        </p>
        <div className="flex">
          {homePageData.topicsData.map((topic) => (
            <CustomDetails
              title={topic.title}
              content={topic.contents}
              key={topic.title}
            />
          ))}
        </div>
      </section>
      <section className="submit-your-articles">
        <h2 className="title">Send your articles !</h2>
        <p>
          You can submit your articles to contribute to the conference. In order
          to
        </p>
      </section>
    </>
  );
}
