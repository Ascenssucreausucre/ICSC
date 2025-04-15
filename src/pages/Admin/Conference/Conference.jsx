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
        <p>Loading...</p>
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
              data={conferenceData.registrationFees}
              conference_id={conferenceData.conference.id}
            />
            <SponsorsManager
              data={conferenceData.sponsors}
              conference_id={conferenceData.conference.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}
