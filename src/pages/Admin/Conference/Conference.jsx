import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import CommitteesBack from "../../../components/CommitteesBack/CommitteesBack";
import FeesManager from "../../../components/FeesManager/FeesManager";
import "./Conference.css";
import CommitteesManager from "../../../components/CommitteesManager/CommitteesManager";

export default function Conference() {
  const { id } = useParams();
  const {
    data: conferenceData,
    loading,
    error,
    refetch,
  } = useFetch(`/front-routes/get-everything-by-conference/${id}`);

  return (
    <div className="conference-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="conference">
          <h1 className="primary title">
            {conferenceData.conference.acronym +
              "'" +
              conferenceData.conference.year}
          </h1>
          <ConferenceCard
            data={conferenceData.conference}
            editTo={`/admin/conferences/edit/${conferenceData.conference.id}`}
          />
          <div className="conference-data-container">
            <CommitteesManager committees={conferenceData.committees} />
            <div className="conference-fees">
              <FeesManager data={conferenceData.registrationFees} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
