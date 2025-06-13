import { useState } from "react";
import RegistrationFeesTable from "../RegistrationFeesTable/RegistrationFeesTable";
import "./FeesManager.css";
import FeesModal from "../FeesModal/FeesModal";
import { useEffect } from "react";
import useSubmit from "../../hooks/useSubmit";
import { useAdminModal } from "../../context/AdminModalContext";
import { useFeedback } from "../../context/FeedbackContext";
import Linkify from "linkify-react";

export default function FeesManager({
  registrationFeesData = [],
  additionalFeesData = [],
  paymentOptions = [],
  conference_id,
  refetch,
}) {
  const [dataToSend, setDataToSend] = useState(null);
  const [feesData, setFeesData] = useState([]);
  const [additionalFees, setadditionalFees] = useState();

  const { submit } = useSubmit();
  const { openModal, openConfirmationModal } = useAdminModal();

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

  const handleDeleteAditionalFees = async (id) => {
    await submit({
      url: `/additional-fee/${additionalFeesData.id}`,
      method: "DELETE",
    });

    refetch();
  };

  const handleDeleteFees = async (id) => {
    await submit({
      url: `/Registration-fees/delete/${id}`,
      method: "DELETE",
    });
    setFeesData((prev) => prev.filter((fee) => fee.id !== id));
  };

  const handleAddOption = async () => {
    openModal({
      url: "/payment-options",
      method: "POST",
      title: "Add an option",
      initialData: {
        name: "",
        price: 0,
        description: "",
        conference_id,
      },
      refreshFunction: refetch,
    });
  };

  const handleEditOption = async (data) => {
    console.log(data);
    openModal({
      url: `/payment-options/${data.id}`,
      method: "PUT",
      title: "Edit this option",
      initialData: {
        name: data.name,
        price: data.price,
        description: data.description || "",
        conference_id,
      },
      refreshFunction: refetch,
    });
  };

  const handleDeleteOption = async (id) => {
    await submit({
      url: `/payment-options/${id}`,
      method: "DELETE",
    });
    refetch();
  };

  return (
    <div className="fees-manager admin-section">
      <h2 className="title secondary">Registration fees</h2>
      {dataToSend ? (
        <FeesModal
          data={dataToSend}
          close={() => setDataToSend(null)}
          refreshFunction={refetch}
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
                onClick={() =>
                  openConfirmationModal({
                    text: "Are you sure to delete this option ?",
                    handleAction: () =>
                      handleDeleteAditionalFees(additionalFees.id),
                  })
                }
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

      <hr style={{ backgroundColor: "var(--secondary-color)" }} />
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
              onClick={() =>
                openConfirmationModal({
                  text: "Are you sure to delete this option ?",
                  handleAction: () =>
                    handleDeleteAditionalFees(additionalFees.id),
                })
              }
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
      <h2 className="title secondary">Options</h2>
      <div className="payment-options-container">
        {paymentOptions.map((option) => (
          <div className="card payment-option" key={option.id}>
            <div className="card-header">
              <h3 className="card-title secondary">{option.name}</h3>
              <span
                className={`tag${
                  option.price === 0 ? " free-option" : " chargeable-option"
                }`}
              >
                {option.price === 0
                  ? "Offered with registration"
                  : option.price + "€"}
              </span>
            </div>
            {option.description ? (
              <p>
                <Linkify>{option.description}</Linkify>
              </p>
            ) : (
              <p className="data-detail">No description for this option.</p>
            )}
            <div className="button-container">
              <button
                className="button small"
                onClick={() => handleEditOption(option)}
              >
                Edit
              </button>
              <button
                className="button small"
                onClick={() =>
                  openConfirmationModal({
                    text: "Are you sure to delete this option ?",
                    handleAction: () => handleDeleteOption(option.id),
                  })
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="button-container">
        <button className="button" onClick={handleAddOption}>
          Add an option
        </button>
      </div>
    </div>
  );
}
