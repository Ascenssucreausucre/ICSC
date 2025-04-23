import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import FeesManager from "../../../components/FeesManager/FeesManager";
import "./Conference.css";
import CommitteesManager from "../../../components/CommitteesManager/CommitteesManager";
import NewsManager from "../../../components/NewsManager/NewsManager";
import TopicManager from "../../../components/TopicsManager/TopicsManager";
import SponsorsManager from "../../../components/SponsorsManager/SponsorsManager";
import ImportantDatesManager from "../../../components/ImportantDatesManager/ImportantDatesManager";
import { useState, useEffect } from "react";
import ConferenceArticles from "../../../components/ConferenceArticles/ConferenceArticles";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

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

  return (
    <div className="conference-container">
      {!conferenceData ? (
        <LoadingScreen />
      ) : (
        <div className="conference">
          <ConferenceCard
            isActive={true}
            data={conferenceData.conference}
            refreshConferences={refetch}
          />
          <div className="conference-data-container">
            <ImportantDatesManager
              data={conferenceData.importantDates}
              conference_id={conferenceData.conference.id}
            />
            <TopicManager
              data={conferenceData.topics}
              conference_id={conferenceData.conference.id}
            />
            <NewsManager news={conferenceData.news} />
            <CommitteesManager
              committees={conferenceData.committees}
              conference_id={conferenceData.conference.id}
            />
            <FeesManager
              registrationFeesData={conferenceData.registrationFees}
              additionnalFeesData={conferenceData.additionnalFees}
              conference_id={conferenceData.conference.id}
              refetch={refetch}
            />
            <SponsorsManager
              data={conferenceData.sponsors}
              conference_id={conferenceData.conference.id}
            />
            <ConferenceArticles
              data={conferenceData.articles}
              conference_id={conferenceData.conference.id}
              refetch={refetch}
            />
          </div>
        </div>
      )}
    </div>
  );
}
