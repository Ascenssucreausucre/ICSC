import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useFetch from "../../../hooks/useFetch";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import FeesManager from "../../../components/FeesManager/FeesManager";
import CommitteesManager from "../../../components/CommitteesManager/CommitteesManager";
import NewsManager from "../../../components/NewsManager/NewsManager";
import TopicManager from "../../../components/TopicsManager/TopicsManager";
import SponsorsManager from "../../../components/SponsorsManager/SponsorsManager";
import ImportantDatesManager from "../../../components/ImportantDatesManager/ImportantDatesManager";
import ConferenceArticles from "../../../components/ConferenceArticles/ConferenceArticles";
import PlenarySessionManager from "../../../components/PlenarySessionManager/PlenarySessionManager";
import SpecialSessionManager from "../../../components/SpecialSessionManager/SpecialSessionManager";
import WorkshopManager from "../../../components/WorkshopsManager/WorkshopsManager";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import VerticalMenu from "../../../components/VerticalMenu/VerticalMenu";

import "./Conference.css";
import LocalInformationsManager from "../../../components/LocalInformationsManager/LocalInformationsManager";

export default function Conference() {
  const { id } = useParams();
  const [conferenceData, setConferenceData] = useState();
  const { data: conference, refetch } = useFetch(
    `/front-routes/get-everything-by-conference/${id}`
  );

  useEffect(() => {
    if (conference) {
      setConferenceData(conference);
    }
  }, [conference]);

  // Refs pour les sections
  const importantDatesRef = useRef(null);
  const topicsRef = useRef(null);
  const newsRef = useRef(null);
  const committeesRef = useRef(null);
  const feesRef = useRef(null);
  const plenaryRef = useRef(null);
  const specialRef = useRef(null);
  const workshopsRef = useRef(null);
  const sponsorsRef = useRef(null);
  const articlesRef = useRef(null);
  const localInfoRef = useRef(null);

  const yOffset = -65;

  const scrollTo = (ref) => {
    if (ref.current) {
      const y =
        ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const menuItems = [
    { name: "Important Dates", goTo: () => scrollTo(importantDatesRef) },
    { name: "Topics", goTo: () => scrollTo(topicsRef) },
    { name: "News", goTo: () => scrollTo(newsRef) },
    { name: "Committees", goTo: () => scrollTo(committeesRef) },
    { name: "Fees", goTo: () => scrollTo(feesRef) },
    { name: "Plenary Sessions", goTo: () => scrollTo(plenaryRef) },
    { name: "Special Sessions", goTo: () => scrollTo(specialRef) },
    { name: "Workshops", goTo: () => scrollTo(workshopsRef) },
    { name: "Local Informations", goTo: () => scrollTo(localInfoRef) },
    { name: "Sponsors", goTo: () => scrollTo(sponsorsRef) },
    { name: "Articles", goTo: () => scrollTo(articlesRef) },
  ];

  const sectionRefs = [
    importantDatesRef,
    topicsRef,
    newsRef,
    committeesRef,
    feesRef,
    plenaryRef,
    specialRef,
    workshopsRef,
    localInfoRef,
    sponsorsRef,
    articlesRef,
  ];

  return (
    <div className="conference-container">
      {!conferenceData ? (
        <LoadingScreen />
      ) : (
        <>
          <VerticalMenu
            values={menuItems}
            sectionRefs={sectionRefs}
            yOffset={yOffset}
          />
          <div className="conference">
            <ConferenceCard
              isActive={true}
              data={conferenceData.conference}
              refreshConferences={refetch}
            />
            <div className="conference-data-container">
              <div ref={importantDatesRef}>
                <ImportantDatesManager
                  data={conferenceData.importantDates}
                  conference_id={conferenceData.conference.id}
                />
              </div>

              <div ref={topicsRef}>
                <TopicManager
                  data={conferenceData.topics}
                  conference_id={conferenceData.conference.id}
                />
              </div>

              <div ref={newsRef}>
                <NewsManager news={conferenceData.news} />
              </div>

              <div ref={committeesRef}>
                <CommitteesManager
                  committees={conferenceData.committees}
                  conference_id={conferenceData.conference.id}
                />
              </div>

              <div ref={feesRef}>
                <FeesManager
                  registrationFeesData={conferenceData.registrationFees}
                  additionnalFeesData={conferenceData.additionnalFees}
                  conference_id={conferenceData.conference.id}
                  refetch={refetch}
                />
              </div>

              <div ref={plenaryRef}>
                <PlenarySessionManager
                  data={conferenceData.plenarySessions}
                  conference_id={conferenceData.conference.id}
                  refetch={refetch}
                />
              </div>

              <div ref={specialRef}>
                <SpecialSessionManager
                  data={conferenceData.specialSessions}
                  conference_id={conferenceData.conference.id}
                  refetch={refetch}
                />
              </div>

              <div ref={workshopsRef}>
                <WorkshopManager
                  data={conferenceData.workshops}
                  conference_id={conferenceData.conference.id}
                  refetch={refetch}
                />
              </div>

              <div ref={localInfoRef}>
                <LocalInformationsManager
                  data={conferenceData.localInformations}
                  conference_id={conferenceData.conference.id}
                  refetch={refetch}
                />
              </div>

              <div ref={sponsorsRef}>
                <SponsorsManager
                  data={conferenceData.sponsors}
                  conference_id={conferenceData.conference.id}
                />
              </div>

              <div ref={articlesRef}>
                <ConferenceArticles
                  data={conferenceData.articles}
                  conference_id={conferenceData.conference.id}
                  refetch={refetch}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
