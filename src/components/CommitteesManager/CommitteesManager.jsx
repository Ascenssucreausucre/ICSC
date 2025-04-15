import { data } from "react-router-dom";
import { useAdminModal } from "../../context/AdminModalContext";
import CommitteeFormModal from "../CommitteeFormModal/CommitteeFormModal";
import CommitteesBack from "../CommitteesBack/CommitteesBack";
import { useState } from "react";

export default function CommitteesManager({ committees, conference_id }) {
  const { openDetailedModal } = useAdminModal();
  const committeeTemplate = {
    conference_id: conference_id,
    type: "",
    members: [],
  };

  const [committeesLocal, setCommitteesLocal] = useState(committees);

  const handleCreateCommittee = () => {
    const handleAddCommittee = (arg) => {
      setCommitteesLocal((prev) => [...prev, arg]);
    };
    openDetailedModal({
      initialData: committeeTemplate,
      method: "POST",
      title: "Create Committee",
      url: "/Committee",
      arg: true,
      refreshFunction: handleAddCommittee,
    });
  };

  return (
    <div className="conference-data admin-section">
      <CommitteeFormModal />
      <h2 className="secondary title">Committees</h2>
      <div className="card-container">
        {committeesLocal.length === 0 ? (
          <p>This conference has no committee.</p>
        ) : (
          committeesLocal.map((committee) => {
            return (
              <CommitteesBack
                data={committee}
                setCommittees={setCommitteesLocal}
                key={committee.id}
              />
            );
          })
        )}
      </div>
      <div className="data-button-container">
        <button className="button small" onClick={handleCreateCommittee}>
          New Committee
        </button>
      </div>
    </div>
  );
}
