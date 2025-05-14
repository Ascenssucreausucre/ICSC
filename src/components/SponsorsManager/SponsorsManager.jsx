import { useEffect, useState } from "react";
import "./SponsorsManager.css";
import { useAdminModal } from "../../context/AdminModalContext";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import useSubmit from "../../hooks/useSubmit";

export default function SponsorsManager({ data, conference_id }) {
  const [sponsors, setSponsors] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState();
  const { openModal } = useAdminModal();
  const { submit } = useSubmit();

  const sponsorTemplate = {
    name: "",
    image: "",
    type: "",
    conference_id: conference_id,
  };

  const imgUrl = import.meta.env.VITE_IMAGE_URL;

  useEffect(() => {
    if (data) {
      setSponsors(data);
    }
  }, [data]);

  const handleCreateSponsor = () => {
    const handleAddSponsor = (newSponsor) => {
      setSponsors([...sponsors, newSponsor]);
    };
    openModal({
      initialData: sponsorTemplate,
      method: "POST",
      url: `/Sponsors`,
      title: `New sponsor`,
      arg: true,
      refreshFunction: handleAddSponsor,
    });
  };

  const handleEditSponsor = (sponsor) => {
    const dataToSend = {
      name: sponsor.name,
      type: sponsor.type,
      image: "",
      conference_id: sponsor.conference_id,
    };

    const handleEditSponsor = (sponsor) => {
      setSponsors((prev) =>
        prev.map((item) =>
          item.id === sponsor.id ? { ...item, ...sponsor } : item
        )
      );
    };

    openModal({
      initialData: dataToSend,
      method: "PUT",
      url: `/Sponsors/update/${sponsor.id}`,
      title: `Edit ${sponsor.type}, ${sponsor.name}`,
      arg: true,
      refreshFunction: handleEditSponsor,
    });
  };

  const handleDeleteSponsor = (id) => {
    submit({
      url: `/Sponsors/delete/${id}`,
      method: "DELETE",
    });
    setSponsors((prev) => prev.filter((item) => item.id !== id));
  };

  const displayedSponsors = showAll ? sponsors : sponsors.slice(0, 4);

  return (
    <div className="sponsors-manager admin-section">
      {confirmation && <ConfirmationModal />}
      <h2 className="title secondary">Sponsors</h2>
      {displayedSponsors.length === 0 ? (
        <p>This conference has no sponsors.</p>
      ) : (
        <div className="sponsors-wrapper">
          {displayedSponsors.map((sponsor) => (
            <div className="card" key={sponsor.id}>
              <div className="card-content">
                <div className="sponsor">
                  <img src={imgUrl + sponsor.image} alt={sponsor.name} />
                </div>
                <div className="card-text">
                  <h3>{sponsor.name}</h3>
                  <p>
                    {`"${sponsor.type}" for ${
                      sponsor.conference
                        ? sponsor.conference.year
                        : "conference with ID : " + sponsor.conference_id
                    }`}
                  </p>
                  <p className="data-detail">
                    The sponsor's logo will display with the same aspect-ratio
                    in the footer. Feel free to resize if it doesn't fit well.
                  </p>
                </div>
              </div>
              <div className="button-container">
                <button
                  className="button small"
                  onClick={() => handleEditSponsor(sponsor)}
                >
                  Edit
                </button>
                <button
                  className="button small"
                  onClick={() => handleDeleteSponsor(sponsor.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {sponsors.length > 4 && (
        <div className="center-button">
          <button className="button small" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "Show all"}
          </button>
        </div>
      )}
      <div className="button-container">
        <button className="button" onClick={handleCreateSponsor}>
          New Sponsor
        </button>
      </div>
    </div>
  );
}
