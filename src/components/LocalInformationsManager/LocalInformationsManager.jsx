import { useAdminModal } from "../../context/AdminModalContext";
import { FileCheck2, LucideUnlink, LinkIcon, FileX2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import useSubmit from "../../hooks/useSubmit";

export default function LocalInformationsManager({
  data,
  refetch,
  conference_id,
}) {
  const { openModal, openConfirmationModal } = useAdminModal();
  const { submit } = useSubmit();

  const handleCreate = async () => {
    openModal({
      url: `/local-informations/`,
      method: `POST`,
      initialData: {
        title: "",
        text: "",
        file: "",
        conference_id,
      },
      title: "Create local information",
      refreshFunction: refetch,
    });
  };

  const handleEdit = async (localInfo) => {
    const { id } = localInfo;

    openModal({
      url: `/local-informations/${id}`,
      method: `PUT`,
      initialData: localInfo,
      title: "Update local information",
      refreshFunction: refetch,
    });
  };

  const handleDelete = async (id) => {
    const response = await submit({
      url: `/local-informations/${id}`,
      method: "DELETE",
    });

    if (!response) {
      return;
    }

    return refetch();
  };

  return (
    <section className="admin-section">
      <h2 className="title secondary">Local Informations</h2>
      <div className="local-info-container">
        {data && data.length > 0 ? (
          data.map((localInfo) => (
            <div className="card row" key={localInfo.id}>
              <div className="flex-1">
                <h2 className="card-title secondary">{localInfo.title}</h2>
                <p className="limited-height-content">{localInfo.text}</p>
                {localInfo?.file ? (
                  <Link
                    to={`${import.meta.env.VITE_IMAGE_URL + localInfo.file}`}
                    className="link"
                    target="__blank"
                    style={{
                      color: "var(--tertiary-color)",
                      width: "fit-content",
                    }}
                  >
                    <FileCheck2 className="text-icon" />
                    Attached file
                    <LinkIcon
                      className="text-icon hover-icon"
                      size="1.2rem"
                      strokeWidth="2.5"
                    />
                  </Link>
                ) : (
                  <div
                    className="alt-link"
                    style={{
                      display: "flex",
                      color: "var(--secondary-color)",
                      alignItems: "center",
                      gap: "0.2rem",
                      width: "fit-content",
                    }}
                  >
                    <FileX2 className="text-icon" /> This workshop has no file.{" "}
                    <LucideUnlink
                      className="text-icon hover-icon broken"
                      size="1.2rem"
                      strokeWidth="2.5"
                    />
                  </div>
                )}
              </div>
              <div className="button-container card-button-container">
                <button
                  className="button small"
                  onClick={() => handleEdit(localInfo)}
                >
                  Edit
                </button>
                <button
                  className="button small"
                  onClick={() =>
                    openConfirmationModal({
                      text: "Are you sure to delete this local information ?",
                      handleAction: () => handleDelete(localInfo.id),
                    })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>This conference has no local informations yet.</p>
        )}
        <div className="button-container">
          <button className="button" onClick={handleCreate}>
            Add local information
          </button>
        </div>
      </div>
    </section>
  );
}
