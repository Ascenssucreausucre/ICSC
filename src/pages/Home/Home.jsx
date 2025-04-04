import CustomDetails from "../../components/CustomDetails/CustomDetails";
import "./Home.css";
import { globalInfos, importantDates, topics } from "./../../fakeDatas";
import ImportantDates from "../../components/ImportantDates/ImportantDates";
export default function Home() {
  return (
    <>
      <section>
        <h2 className="title primary">Invitation</h2>
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
      <ImportantDates />
      <section className="topics">
        <h2 className="title primary">Topics of interest</h2>
        <p>
          This edition's main topics are written down below. Have in mind that
          the conference will treat more topics than just the main ones.
        </p>
        <div className="flex">
          {topics.map((topic) => (
            <CustomDetails
              title={topic.title}
              content={topic.content}
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
