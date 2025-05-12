import { useState } from "react";
import SpecialSessionModal from "../SpecialSessionModal/SpecialSessionModal";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import useSubmit from "../../hooks/useSubmit";

export default function SpecialSessionManager({
  conference_id,
  data,
  refetch,
}) {
  const [formData, setFormData] = useState(null);
  const [displayModal, setDisplayModal] = useState(false);
  const [confirmation, setConfirmation] = useState();

  const { submit } = useSubmit();

  const handleCreateSession = (e) => {
    e.preventDefault;
    setDisplayModal(true);
  };

  const handleEditSession = (session) => {
    console.log(session);
    setFormData(session);
    setDisplayModal(true);
  };

  const handleDeleteSession = async (id) => {
    const response = await submit({
      url: `/special-sessions/${id}`,
      method: "DELETE",
    });
    if (!response) return;
    refetch();
  };

  return (
    <section className="admin-section">
      {displayModal && (
        <SpecialSessionModal
          data={{ ...formData, conference_id }}
          close={() => {
            setDisplayModal(false);
            setFormData(null);
          }}
          refetch={refetch}
        />
      )}
      {confirmation && (
        <ConfirmationModal
          handleAction={() => confirmation()}
          unShow={() => setConfirmation(null)}
          text="Are you sure to delete this Special Session ?"
        />
      )}
      <h2 className="secondary title">Special Session</h2>
      <div className="session-container">
        {data ? (
          data.map((session) => (
            <div className="card row">
              <div className="flex-1">
                <h2 className="card-title">{session.title}</h2>
                <p className="data-detail">
                  by{" "}
                  {session.authors.map((author, index) =>
                    index + 1 < session.authors.length
                      ? `${author.name} ${author.surname}, `
                      : `${author.name} ${author.surname}.`
                  )}
                </p>
                <p className="limited-height-content">{session.summary}</p>
              </div>
              <div className="button-container card-button-container">
                <button
                  className="button"
                  onClick={() => handleEditSession(session)}
                >
                  Edit
                </button>
                <button
                  className="button"
                  onClick={() =>
                    setConfirmation(() => () => handleDeleteSession(session.id))
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>This conference has no special session yet.</p>
        )}
      </div>
      <div className="button-container">
        <button className="button" onClick={handleCreateSession}>
          Add a special session
        </button>
      </div>
    </section>
  );
}
