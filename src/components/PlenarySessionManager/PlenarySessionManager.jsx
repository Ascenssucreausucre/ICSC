import { useState } from "react";
import PlenarySessionForm from "./PlenarySessionForm";
import useSubmit from "../../hooks/useSubmit";
import { useAdminModal } from "../../context/AdminModalContext";

export default function PlenarySessionManager({
  data,
  conference_id,
  refetch,
}) {
  const [formData, setFormData] = useState(null);
  const { openConfirmationModal } = useAdminModal();

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
      <h2 className="title secondary">Plenary Sessions</h2>
      <div className="plenary-session-container">
        {data && data.length > 0 ? (
          data.map((session) => (
            <div className="card" key={session.id}>
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
                    openConfirmationModal({
                      text: "Are you sure to delete this plenary session ?",
                      handleAction: () => handleDeleteSession(session.id),
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>This conference has no plenary session yet.</p>
        )}
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
