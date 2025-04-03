import { data } from "react-router-dom";
import { useAdminModal } from "../../context/AdminModalContext";
import CommitteeFormModal from "../CommitteeFormModal/CommitteeFormModal";
import CommitteesBack from "../CommitteesBack/CommitteesBack";

export default function CommitteesManager({ committees }) {
  const { detailedModalData, openDetailedModal } = useAdminModal();
  const committeeTemplate = {
    conferenceId: "",
    type: "",
    members: [
      { committeeRole: { title: "" }, affiliation: "", name: "", surname: "" },
    ],
  };
  const handleCreateCommittee = () => {
    openDetailedModal({
      initialData: committeeTemplate,
      method: "POST",
      title: "Create Committee",
      url: "/Committee",
    });
  };
  console.log(committees);
  return (
    <div className="conference-data">
      <CommitteeFormModal />
      <h2 className="secondary title">Committees</h2>
      <div className="conference-committees">
        {committees.map((committee) => {
          return <CommitteesBack data={committee} key={committee.id} />;
        })}
      </div>
      <div className="data-button-container">
        <button className="button small" onClick={handleCreateCommittee}>
          New Committee
        </button>
      </div>
    </div>
  );
}
