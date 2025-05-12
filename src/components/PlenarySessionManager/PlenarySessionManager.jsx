import { useState } from "react";
import PlenarySessionForm from "./PlenarySessionForm";
import useSubmit from "../../hooks/useSubmit";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

export default function PlenarySessionManager({
  data,
  conference_id,
  refetch,
}) {
  const [formData, setFormData] = useState(null);
  const [confirmation, setConfirmation] = useState({
    confirm: false,
    id: null,
  });

  const { submit } = useSubmit();

  const plenarySessionTemplate = {
    conference_id,
    title: "",
    authors: [{ id: "" }],
    affiliation: "",
    authors_resume: "",
    session_resume: "",
    image: "",
  };

  const handleDeleteSession = (id) => {
    const response = submit({
      url: `/plenary-sessions/${id}`,
      method: "DELETE",
    });

    if (!response) return;

    return refetch();
  };

  return (
    <section className="plenary-session-manager admin-section">
      {formData && (
        <PlenarySessionForm
          data={formData}
          close={() => setFormData(null)}
          refetch={refetch}
        />
      )}
      {confirmation.confirm && (
        <ConfirmationModal
          handleAction={() => handleDeleteSession(confirmation.id)}
          text="Delete this plenary session ?"
          unShow={() => setConfirmation({ confirm: false, id: null })}
        />
      )}
      <h1 className="title secondary">Plenary Sessions</h1>
      <div className="plenary-session-container">
        {data.map((session) => (
          <div className="card">
            <div className="card-content">
              <div className="image-container">
                <img
                  src={`${import.meta.env.VITE_IMAGE_URL}${session.image}`}
                  alt=""
                />
              </div>
              <div className="card-text">
                <h2 className="card-title">{session.title}</h2>
                <p className="data-detail">
                  by{" "}
                  <strong>
                    {session.authors.map(
                      (author, index) =>
                        `${author?.title && author.title} ${author.name} ${
                          author.surname
                        }, ${session.affiliation}${
                          index + 1 < session.authors.length ? "," : "."
                        }`
                    )}
                  </strong>
                </p>
              </div>
            </div>
            <div className="button-container">
              <button
                className="button small"
                onClick={() => setFormData(session)}
              >
                Edit
              </button>
              <button
                className="button small"
                onClick={() =>
                  setConfirmation({ confirm: true, id: session.id })
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button
          className="button small"
          onClick={() => setFormData(plenarySessionTemplate)}
        >
          Create Plenary Session
        </button>
      </div>
    </section>
  );
}
