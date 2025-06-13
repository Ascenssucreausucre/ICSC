import useSubmit from "../../hooks/useSubmit";
import { useAdminModal } from "../../context/AdminModalContext";
import "./CommitteesBack.css";
import { useState } from "react";

export default function CommitteesBack({ data, setCommittees }) {
  const { openDetailedModal, openConfirmationModal } = useAdminModal();
  const { submit } = useSubmit();

  const handleManageCommittee = () => {
    const handleReplaceEditedCommittee = (arg) => {
      setCommittees((prev) => {
        return prev.map((item) => {
          if (item.id === arg.id) {
            for (const [key, value] of Object.entries(arg)) {
              item[key] = value;
            }
          }
          return item;
        });
      });
    };
    openDetailedModal({
      url: `/Conferences/update/${data.id}`,
      method: "PUT",
      initialData: data,
      title: `Manage ${data.type}'s Members`,
      arg: true,
      refreshFunction: handleReplaceEditedCommittee,
    });
  };

  const handleDeleteCommittee = async (id) => {
    await submit({
      method: "DELETE",
      url: `/Committee/delete/${id}`,
    });
    setCommittees((prev) => prev.filter((item) => item.id !== data.id));
  };

  return (
    <>
      <div className="committee-back-container flex-1 card">
        <div className="committee-data flex-1">
          <h2 className="secondary card-title">{data.type}</h2>
          <p>
            This committee has {data.members.length}{" "}
            {data.members.length > 1 ? "members" : "member"}.
          </p>
        </div>
        <div className="data-button-container">
          <button className="button small" onClick={handleManageCommittee}>
            Manage
          </button>
          <button
            className="button small"
            onClick={() =>
              openConfirmationModal({
                text: "Are you sure to delete this comittee ?",
                handleAction: () => handleDeleteCommittee(data.id),
              })
            }
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
