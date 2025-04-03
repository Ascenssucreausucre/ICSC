import useSubmit from "../../hooks/useSubmit";
import { useAdminModal } from "../../context/AdminModalContext";
import "./CommitteesBack.css";
import { useState } from "react";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import CommitteeFormModal from "../CommitteeFormModal/CommitteeFormModal";

export default function CommitteesBack({ data }) {
  const [confirmation, setConfirmation] = useState(false);
  const { openDetailedModal } = useAdminModal();
  const { submit } = useSubmit();

  const handleManageCommittee = () => {
    openDetailedModal({
      url: `/Conferences/update/${data.id}`,
      method: "PUT",
      initialData: data,
      title: `Manage ${data.type}'s Members`,
    });
  };

  const handleDeleteCommittee = async () => {
    await submit({
      method: "DELETE",
      url: `/Committee/delete/${data.id}`,
    });
  };

  return (
    <div className="committee-back-container">
      <CommitteeFormModal />
      {confirmation ? (
        <ConfirmationModal
          handleAction={handleDeleteCommittee}
          text={`Are you sure to delete ${data.type} ?`}
          textAction={"Delete"}
          unShow={setConfirmation}
        />
      ) : null}
      <div className="committee-data">
        <h2>{data.type}</h2>
        <p>
          This committee has {data.members.length}{" "}
          {data.members.length > 1 ? "members" : "member"}.
        </p>
      </div>
      <div className="data-button-container">
        <button className="button small" onClick={handleManageCommittee}>
          Manage
        </button>
        <button className="button small" onClick={() => setConfirmation(true)}>
          Delete
        </button>
      </div>
    </div>
  );
}
