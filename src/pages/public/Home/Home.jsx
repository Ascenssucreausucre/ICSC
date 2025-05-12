import CustomDetails from "../../../components/CustomDetails/CustomDetails";
import "./Home.css";
import ImportantDates from "../../../components/ImportantDates/ImportantDates";
import { Link, useLoaderData } from "react-router-dom";
import RotatingText from "../../../components/RotatingText/RotatingText";
import { LayoutGroup, motion } from "framer-motion";
import MagnetLines from "../../../components/MagnetLines/MagnetLines";
import ScrollVelocity from "../../../components/ScrollVelocity/ScrollVelocity";

export default function Home() {
  const { conferenceData, importantDatesData, topicsData } = useLoaderData();
  const convertedDates =
    !importantDatesData || importantDatesData.length < 0
      ? null
      : {
          initial_submission_due: new Date(
            importantDatesData.initial_submission_due
          ),
          paper_decision_notification: new Date(
            importantDatesData.paper_decision_notification
          ),
          final_submission_due: new Date(
            importantDatesData.final_submission_due
          ),
          registration: new Date(importantDatesData.registration),
          congress_opening: new Date(importantDatesData.congress_opening),
          congress_closing: new Date(importantDatesData.congress_closing),
        };

  const allTexts = topicsData.flatMap((topic) =>
    topic.contents.map((content) => content.text)
  );

  const allTextsTwoLines = () => {
    const half = Math.ceil(allTexts.length / 2);

    const firstHalf = allTexts.slice(0, half).join(", ");
    const secondHalf = allTexts.slice(half).join(", ");

    return secondHalf.length > 1 ? [firstHalf, secondHalf] : [firstHalf];
  };

  const filteredTexts = allTexts.filter((text) => text.length < 18);

  const shuffledTexts = filteredTexts.sort(() => 0.5 - Math.random()); // Mélange

  const randomTexts = shuffledTexts.slice(0, 10); // Prend les 10 premiers

  return (
    <>
      <section className="home-section">
        <h2 className="title primary">Invitation</h2>
        {/* <MagnetLines
          containerSize="50%"
          lineColor="var(--primary-color)"
          lineWidth="0.2rem"
          lineHeight="2rem"
          style={{
            position: "absolute",
            right: "-25%",
            zIndex: "-1",
            opacity: 0.5,
          }}
        /> */}
        <p className="sub-title">
          It is our great pleasure to invite you to participate in the IEEE
          {" " + conferenceData.year + " "}
          {conferenceData.conference_index}th International Conference on
          Systems and Control ({conferenceData.acronym}'{conferenceData.year}).
        </p>
        {convertedDates && (
          <p className="sub-title">
            Following the previous editions, the{" "}
            {conferenceData.conference_index}
            th edition of the International Conference on Systems and Control
            will be held from{" "}
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
              , 2025 in {conferenceData.city}, {conferenceData.country}.
            </span>
          </p>
        )}
        <div className="center-button">
          <Link to={"/registration"} className="button">
            Register to the conference
          </Link>
        </div>
      </section>
      <section className="topics home-section">
        <LayoutGroup>
          <motion.div className="text-flex title primary" layout>
            <motion.h2 layout>Topics of interest</motion.h2>
            {randomTexts.length >= 1 && (
              <RotatingText
                texts={randomTexts}
                mainClassName=""
                staggerFrom={"last"}
                initial={{ y: "150%" }}
                animate={{ y: 0 }}
                exit={{ y: "-150%" }}
                staggerDuration={0.025}
                splitLevelClassName=""
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={3000}
              />
            )}
          </motion.div>
        </LayoutGroup>
        <p>
          This edition's main topics are written down below. Have in mind that
          the conference will treat more topics than just the main ones.
        </p>
        <div className="flex">
          {topicsData.map((topic) => (
            <CustomDetails
              title={topic.title}
              content={topic.contents}
              key={topic.title}
            />
          ))}
        </div>
        <ScrollVelocity
          texts={allTextsTwoLines()}
          className="scroll-velocity special-gothic-expanded-one-regular"
        />
      </section>
      <section className="send-your-articles home-section">
        <section className="alternative-background">
          <h2 className="title">Send your articles !</h2>
          <p>
            You can submit your articles to contribute to the conference. In
            order to do so, you will have to follow instructions. See more on{" "}
            <Link to={"/submission"} className="link white">
              submission page.
            </Link>
          </p>
          <p>
            Selected articles will be presented during conferences, !!!describe
            why ppl should submit their articles!!!
          </p>
        </section>
        <ImportantDates data={convertedDates} />
      </section>
    </>
  );
}
