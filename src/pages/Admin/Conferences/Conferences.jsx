import useFetch from "../../../hooks/useFetch";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import { Outlet, useNavigate } from "react-router-dom";
import "./Conferences.css";
import { AnimatePresence, motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonConferenceCard from "../../../components/ConferenceCard/SkeletonConferenceCard";
import { useAdminModal } from "../../../context/AdminModalContext";
import { useState } from "react";
import { useEffect } from "react";

export default function Conferences() {
  const { openModal } = useAdminModal();
  const [conferenceData, setConferenceData] = useState();

  const navigate = useNavigate();

  // Utilisation de useFetch pour récupérer les conférences
  const {
    data: conferences,
    loading,
    error,
    refetch,
  } = useFetch(`/Conferences`);

  useEffect(() => {
    if (!loading && !error) {
      setConferenceData(conferences);
    }
  }, [conferences]);

  const handleNavigate = (conference) => {
    navigate(`${conference.id}`);
  };

  const handleCreateConference = () => {
    openModal({
      url: "/Conferences",
      method: "POST",
      initialData: {
        acronym: "",
        city: "",
        country: "",
        year: 2003,
        title: "",
        conference_index: 0,
        banner: "",
        primary_color: "#eb4c4c",
        secondary_color: "#502f2f",
        tertiary_color: "#4736a8",
      },
      title: "Create Conference",
      refreshFunction: handleNavigate,
      arg: true,
    });
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="admin-section">
      <h1 className="secondary title">All conferences</h1>
      <AnimatePresence>
        {!loading ? (
          conferenceData && conferenceData.length > 0 ? (
            conferenceData.map((conference) => (
              <motion.div
                key={conference.id}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "anticipate" }}
              >
                <ConferenceCard
                  key={conference.id}
                  data={conference}
                  refreshConferences={refetch}
                  deleteSelf={setConferenceData}
                />
              </motion.div>
            ))
          ) : (
            <p>No conferences found.</p>
          )
        ) : (
          <SkeletonConferenceCard />
        )}
      </AnimatePresence>
      <button className="button" onClick={handleCreateConference}>
        New Conference
      </button>
      <Outlet />
    </section>
  );
}
