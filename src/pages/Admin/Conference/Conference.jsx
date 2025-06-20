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
import ContactManager from "../../../components/ContactManager/ContactManager";

export default function Conference() {
  const { id } = useParams();
  const [conferenceData, setConferenceData] = useState();
  const { data: conference, refetch } = useFetch(
    `/front/get-everything-by-conference/${id}`
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
        <>
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

              <ContactManager
                contacts={conferenceData.contacts}
                conference_id={conferenceData.conference.id}
                refetch={refetch}
              />

              <NewsManager news={conferenceData.news} />

              <CommitteesManager
                committees={conferenceData.committees}
                conference_id={conferenceData.conference.id}
              />

              <FeesManager
                registrationFeesData={conferenceData.registrationFees}
                additionalFeesData={conferenceData.additionalFees}
                paymentOptions={conferenceData.paymentOptions}
                conference_id={conferenceData.conference.id}
                registrationsOpened={
                  conferenceData.conference?.registrations_open
                }
                refetch={refetch}
              />

              <PlenarySessionManager
                data={conferenceData.plenarySessions}
                conference_id={conferenceData.conference.id}
                refetch={refetch}
              />

              <SpecialSessionManager
                data={conferenceData.specialSessions}
                conference_id={conferenceData.conference.id}
                refetch={refetch}
              />

              <WorkshopManager
                data={conferenceData.workshops}
                conference_id={conferenceData.conference.id}
                refetch={refetch}
              />

              <LocalInformationsManager
                data={conferenceData.localInformations}
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
        </>
      )}
    </div>
  );
}
