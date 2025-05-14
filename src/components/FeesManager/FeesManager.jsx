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
  additionnalFeesData,
  conference_id,
  refetch,
}) {
  const [dataToSend, setDataToSend] = useState(null);
  const [feesData, setFeesData] = useState([]);
  const [additionnalFees, setAdditionnalFees] = useState();
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
    if (additionnalFeesData) {
      setAdditionnalFees(additionnalFeesData);
    } else {
      setAdditionnalFees(null);
    }
  }, [additionnalFeesData]);

  const registrationFeestemplate = {
    description: "",
    conference_id: conference_id,
    feecategories: [],
  };

  const additionnalFeesTemplate = {
    additionnal_paper_fee: "",
    additionnal_page_fee: "",
    conference_id,
  };

  const handleAddAdditionnalFees = () => {
    openModal({
      url: `/Additionnal-fee/`,
      initialData: additionnalFeesTemplate,
      method: "POST",
      title: "Create additionnal fees",
      refreshFunction: refetch,
    });
  };

  const handleEditAdditionnalFees = () => {
    openModal({
      url: `/Additionnal-fee/${additionnalFeesData.id}`,
      initialData: additionnalFeesData,
      method: "PUT",
      title: "Update additionnal fees",
      arg: true,
      refreshFunction: refetch,
    });
  };

  const handleDeleteAdditionnalFees = async () => {
    const response = submit({
      url: `/Additionnal-fee/${additionnalFeesData.id}`,
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
      <h2 className="title secondary">Additionnal Fees</h2>
      {!additionnalFees ? (
        <p>No additionnal fee found for this conference</p>
      ) : (
        <div className="card">
          <p>
            <strong>Additionnal paper charge: </strong>{" "}
            {additionnalFees.additionnal_paper_fee}
          </p>
          <p>
            <strong>Additionnal page charge: </strong>{" "}
            {additionnalFees.additionnal_page_fee}
          </p>
          <div className="button-container">
            <button
              className="button small"
              onClick={handleEditAdditionnalFees}
            >
              Edit
            </button>
            <button
              className="button small"
              onClick={handleDeleteAdditionnalFees}
            >
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="button-container">
        <button
          onClick={handleAddAdditionnalFees}
          className="button"
          disabled={!!additionnalFeesData}
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
