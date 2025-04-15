import { Link, useLoaderData } from "react-router-dom";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import "./AdminMainPage.css";

export default function AdminMainPage() {
  const data = useLoaderData();

  return (
    <div className="admin-dashboard">
      <h1 className="secondary">Admin Dashboard</h1>
      <h2 className="title white">Current Conference :</h2>
      <div className="admin-infos-container">
        {data ? (
          <ConferenceCard
            data={data.currentConference}
            key={data.currentConference.year}
            deleteTo={"/admin/conferences"}
            editTo={`conferences/edit/${data.currentConference.id}`}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Link to="conferences" className="link white">
        See all the conferences
      </Link>
    </div>
  );
}
