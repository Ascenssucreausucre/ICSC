import { Link, useLoaderData } from "react-router-dom";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import "./AdminMainPage.css";
import useFetch from "../../../hooks/useFetch";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function AdminMainPage() {
  const { data: currentConference, loading } = useFetch("/conferences/current");

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <section className="admin-dashboard admin-section">
      <h1 className="title dashboard-title secondary">Admin Dashboard</h1>
      <h2 className="title secondary">Current Conference :</h2>
      <div className="admin-infos-container">
        {currentConference ? (
          <ConferenceCard
            data={currentConference}
            key={currentConference.year}
            deleteTo={"/admin/conferences"}
            editTo={`conferences/edit/${currentConference.id}`}
          />
        ) : (
          <p>No conference found.</p>
        )}
      </div>
      <Link to="conferences" className="link">
        See all the conferences
      </Link>
    </section>
  );
}
