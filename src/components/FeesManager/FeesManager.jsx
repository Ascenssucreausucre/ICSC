import { useState } from "react";
import RegistrationFeesTable from "../RegistrationFeesTable/RegistrationFeesTable";
import "./FeesManager.css";
import FeesModal from "../FeesModal/FeesModal";
import { useEffect } from "react";
import useSubmit from "../../hooks/useSubmit";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { useAdminModal } from "../../context/AdminModalContext";
import { FeedbackProvider, useFeedback } from "../../context/FeedbackContext";

export default function FeesManager({
  registrationFeesData,
  additionalFeesData,
  conference_id,
  refetch,
}) {
  const [dataToSend, setDataToSend] = useState(null);
  const [feesData, setFeesData] = useState([]);
  const [additionalFees, setadditionalFees] = useState();
  const [confirmation, setConfirmation] = useState({
    id: "",
    display: false,
  });

  const { submit } = useSubmit();
  const { openModal } = useAdminModal();
  const { showFeedback } = useFeedback();

  useEffect(() => {
    if (registrationFeesData) {
      setFeesData(registrationFeesData);
    } else {
      setFeesData([]);
    }
  }, [registrationFeesData]);
  useEffect(() => {
    if (additionalFeesData) {
      setadditionalFees(additionalFeesData);
    } else {
      setadditionalFees(null);
    }
  }, [additionalFeesData]);

  const registrationFeestemplate = {
    description: "",
    conference_id: conference_id,
    feecategories: [],
  };

  const additionalFeesTemplate = {
    additional_paper_fee: "",
    additional_page_fee: "",
    max_articles: "",
    given_articles_per_registration: "",
    conference_id,
  };

  const handleAddadditionalFees = () => {
    openModal({
      url: `/additional-fee/`,
      initialData: additionalFeesTemplate,
      method: "POST",
      title: "Create additional fees",
      refreshFunction: refetch,
    });
  };

  const handleEditadditionalFees = () => {
    openModal({
      url: `/additional-fee/${additionalFeesData.id}`,
      initialData: additionalFeesData,
      method: "PUT",
      title: "Update additional fees",
      arg: true,
      refreshFunction: refetch,
    });
  };

  const handleDeleteadditionalFees = async () => {
    const response = submit({
      url: `/additional-fee/${additionalFeesData.id}`,
      method: "DELETE",
    });

    refetch();
  };

  const handleDeleteFees = (id) => {
    setFeesData((prev) => prev.filter((fee) => fee.id !== id));
    submit({
      url: `/Registration-fees/delete/${id}`,
      method: "DELETE",
    });
  };

  return (
    <div className="fees-manager admin-section">
      <h2 className="title secondary">Additional Fees</h2>
      {!additionalFees ? (
        <p>No additional fee found for this conference</p>
      ) : (
        <div className="card">
          <p>
            <strong>Additional paper charge: </strong>{" "}
            {additionalFees.additional_paper_fee}
          </p>
          <p>
            <strong>Additional page charge: </strong>{" "}
            {additionalFees.additional_page_fee}
          </p>
          <p>
            <strong>Max articles: </strong> {additionalFees.max_articles}
          </p>
          <p>
            <strong>Given articles with registration: </strong>{" "}
            {additionalFees.given_articles_per_registration}
          </p>
          <div className="button-container">
            <button className="button small" onClick={handleEditadditionalFees}>
              Edit
            </button>
            <button
              className="button small"
              onClick={handleDeleteadditionalFees}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="button-container">
        <button
          onClick={handleAddadditionalFees}
          className="button"
          disabled={!!additionalFeesData}
        >
          Add addtionnal fees
        </button>
      </div>
      <hr style={{ backgroundColor: "var(--secondary-color)" }} />
      <h2 className="title secondary">Registration fees</h2>
      {dataToSend ? (
        <FeesModal
          data={dataToSend}
          close={() => setDataToSend(null)}
          refreshFunction={refetch}
        />
      ) : null}
      {confirmation.display ? (
        <ConfirmationModal
          handleAction={() => handleDeleteFees(confirmation.id)}
          text="Are you sure to delete these registration fees ?"
          unShow={(arg) => setConfirmation({ ...confirmation, display: arg })}
        />
      ) : null}
      {feesData.length === 0 ? (
        <p>This conference has no registration fees.</p>
      ) : (
        feesData.map((fee) => (
          <div className="fee-manager" key={fee.id}>
            <RegistrationFeesTable data={fee} />
            <div className="button-container" style={{ paddingInline: "25%" }}>
              <button className="button" onClick={() => setDataToSend(fee)}>
                Manage Fees
              </button>
              <button
                className="button"
                onClick={() => setConfirmation({ id: fee.id, display: true })}
              >
                Delete Fees
              </button>
            </div>
          </div>
        ))
      )}
      <div className="button-container">
        <button
          className="button"
          onClick={() => setDataToSend(registrationFeestemplate)}
        >
          New registration fees
        </button>
      </div>
    </div>
  );
}
