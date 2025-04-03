import { useState } from "react";
import useSubmit from "../../hooks/useSubmit";
import "./ConferenceCard.css";
import { Link } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useAdminModal } from "../../context/AdminModalContext";

export default function ConferenceCard({ data, refreshConferences }) {
  const { submit, submitLoading } = useSubmit();
  const [confirmation, setConfirmation] = useState(false);
  const { openModal } = useAdminModal();

  const formattedData = Object.fromEntries(
    Object.entries(data).filter(([key]) => !["id", "current"].includes(key))
  );

  const handleSetCurrent = async (e) => {
    e.preventDefault();

    await submit({
      url: `/Conferences/${data.id}/setCurrent`,
      method: "PUT",
    });

    // Rafraîchir les conférences après modification
    if (refreshConferences) refreshConferences();
  };

  const handleDeleteConference = async () => {
    await submit({
      url: `/Conferences/delete/${data.id}`,
      method: "DELETE",
    });
    if (refreshConferences) refreshConferences();
  };

  const handleEditConference = () => {
    openModal({
      url: `/Conferences/update/${data.id}`,
      method: "PUT",
      initialData: formattedData,
      title: `Edit conference ${data.acronym}'${data.year}`,
    });
  };

  return (
    <>
      {confirmation ? (
        <ConfirmationModal
          text={`Are you sure you want to delete conference ${data.acronym}'${data.year} ? This action is definitive and will be irreversible.`}
          handleAction={handleDeleteConference}
          textAction={"Delete"}
          unShow={setConfirmation}
        />
      ) : null}
      <div className="card" key={data.id}>
        <div className="card-content-container">
          <ul>
            <Link
              className="card-title"
              to={`/admin/conferences/${data.id}`}
            >{`${data.acronym}'${data.year}`}</Link>
            {Object.entries(formattedData).map(([name, value]) => (
              <li key={name}>
                <strong>
                  {String(name).charAt(0).toUpperCase() + String(name).slice(1)}
                </strong>
                : {value}
              </li>
            ))}
          </ul>
          <button
            className="button small"
            onClick={handleSetCurrent}
            disabled={!!data.current}
          >
            {!data.current ? "Set as current" : "Current"}
          </button>
        </div>
        <div className="button-container">
          <button className="button small" onClick={handleEditConference}>
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => setConfirmation(true)}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
