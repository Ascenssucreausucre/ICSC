import { FileCheck2, LucideUnlink, LinkIcon, FileX2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminModal } from "../../context/AdminModalContext";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import useSubmit from "../../hooks/useSubmit";

export default function WorkshopManager({ data, conference_id, refetch }) {
  const [confirmation, setConfirmation] = useState();
  const { openModal } = useAdminModal();
  const { submit } = useSubmit();

  const formatDate = (date, country = "en-US", props) => {
    const options = props ?? { day: "numeric", month: "long" }; // fallback si props est null ou undefined
    const converted = new Date(date);
    return converted.toLocaleDateString(country, options);
  };

  const createWorkshop = () => {
    openModal({
      url: "/workshops/",
      method: "POST",
      initialData: {
        title: "",
        presenters: "",
        date_from: new Date(),
        date_to: new Date(),
        text: "",
        additional_file: "",
        ...(conference_id && { conference_id }),
      },
      title: "New workshop",
      refreshFunction: refetch,
    });
  };

  const editWorkshop = (workshop) => {
    const { additional_file, date_to, date_from, title, text, presenters } =
      workshop;
    const dates = {
      date_from: new Date(date_from),
      date_to: new Date(date_to),
    };
    openModal({
      url: `/workshops/${workshop.id}`,
      method: "PUT",
      initialData: {
        title,
        presenters,
        ...dates,
        text,
        additional_file: "",
        conference_id,
      },
      title: "New workshop",
      refreshFunction: refetch,
    });
  };

  const handleDelete = async (id) => {
    const response = await submit({
      url: `/workshops/${id}`,
      method: "DELETE",
    });

    if (!response) {
      return;
    }

    return refetch();
  };

  return (
    <section className="admin-section">
      {confirmation && (
        <ConfirmationModal
          handleAction={() => handleDelete(confirmation.id)}
          text={`Are you sure to delete workshop ${confirmation.title} ?`}
          unShow={() => setConfirmation(null)}
        />
      )}
      <h2 className="title secondary">Workshops</h2>
      {data && data.length > 0 ? (
        <div className="workshops-container">
          {data.map((workshop) => (
            <div className="card row">
              <div className="flex-1">
                <h2 className="card-title secondary">{workshop.title}</h2>
                <p className="data-detail">{`Presented by ${workshop.presenters}`}</p>
                <p className="data-detail">{`from ${formatDate(
                  workshop.date_from
                )} to ${formatDate(workshop.date_to)}.`}</p>
                <p className="limited-height-content">{workshop.text}</p>
                {workshop?.additional_file ? (
                  <Link
                    to={`${
                      import.meta.env.VITE_IMAGE_URL + workshop.additional_file
                    }`}
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
                  onClick={() => editWorkshop(workshop)}
                >
                  Edit
                </button>
                <button
                  className="button small"
                  onClick={() => setConfirmation(workshop)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>This conference has no workshop yet.</p>
      )}
      <div className="button-container">
        <button className="button" onClick={createWorkshop}>
          New workshop
        </button>
      </div>
    </section>
  );
}
