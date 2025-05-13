import { Link, useLoaderData } from "react-router-dom";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import "./AdminMainPage.css";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function AdminMainPage() {
  const currentConference = useLoaderData();

  console.log(currentConference);

  return (
    <div className="admin-dashboard">
      <h1 className="white title dashboard-title">Admin Dashboard</h1>
      <h2 className="title white">Current Conference :</h2>
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
      <Link to="conferences" className="link white">
        See all the conferences
      </Link>
    </div>
  );
}
