import "./Header.css";
import NavBar from "../NavBar/NavBar";
import React, { useState, useMemo } from "react";
import DisplayNews from "../DisplayNews/DisplayNews";
import { AnimatePresence } from "framer-motion";
import SplitText from "../SplitText";
import BlurText from "../BlurText";

// Mémoïsation de BlurText
const MemoizedBlurText = React.memo(BlurText);

// Composant séparé pour la bannière
function HeaderBanner({ conferenceData, convertedDates, congressDatesText }) {
  return (
    <div
      className="page-title"
      style={{
        backgroundImage: `linear-gradient(60deg, var(--primary-color) 0%, rgba(0, 0, 0, 0.2) 60%), url(${
          import.meta.env.VITE_IMAGE_URL + "/" + conferenceData.banner
        })`,
      }}
    >
      <SplitText
        text={conferenceData.acronym + " " + conferenceData.year}
        className="title"
        delay={100}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        easing="easeOutCubic"
        threshold={0.2}
        onLetterAnimationComplete={null}
      />
      {convertedDates && (
        <MemoizedBlurText
          text={congressDatesText}
          delay={15}
          animateBy="letter"
          direction="bottom"
          onAnimationComplete={null}
          className="sub-title"
        />
      )}
    </div>
  );
}

export default function Header({ banner = false, data }) {
  const { importantDatesData, conferenceData, newsData } = data;

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

  const congressDatesText = useMemo(() => {
    if (!convertedDates) return "";
    return `${convertedDates.congress_opening.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    })} to ${convertedDates.congress_closing.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}, ${conferenceData.year} in ${conferenceData.city}, ${
      conferenceData.country
    }.`;
  }, [convertedDates, conferenceData]);

  const [displayNews, setDisplayNews] = useState(true);
  const handleCloseNews = () => setDisplayNews(false);

  return (
    <header>
      <NavBar data={conferenceData} />
      {banner && (
        <HeaderBanner
          conferenceData={conferenceData}
          convertedDates={convertedDates}
          congressDatesText={congressDatesText}
        />
      )}
      <AnimatePresence>
        {displayNews && (
          <DisplayNews
            news={newsData}
            close={handleCloseNews}
            vapidPublicKey={import.meta.env.VITE_VAPID_PUBLIC_KEY}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
