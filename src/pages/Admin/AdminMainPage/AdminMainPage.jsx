import { NavLink, useLoaderData } from "react-router-dom";
import ConferenceCard from "../../../components/ConferenceCard/ConferenceCard";
import Conferences from "../Conferences/Conferences";

export default function AdminMainPage() {
  const data = useLoaderData();

  return (
    <div className="admin-dashboard">
      <h1 className="secondary">Admin Dashboard</h1>
      <h2>Current Conference :</h2>
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
      <NavLink to="conferences">See all the conferences</NavLink>
    </div>
  );
}
