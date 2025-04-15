import { useState } from "react";
import RegistrationFeesTable from "../RegistrationFeesTable/RegistrationFeesTable";
import "./FeesManager.css";
import FeesModal from "../FeesModal/FeesModal";
import { useEffect } from "react";
import useSubmit from "../../hooks/useSubmit";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

export default function FeesManager({ data, conference_id }) {
  const [dataToSend, setDataToSend] = useState(null);
  const [feesData, setFeesData] = useState([]);
  const [confirmation, setConfirmation] = useState({
    id: "",
    display: false,
  });

  const { submit } = useSubmit();

  useEffect(() => {
    if (data) setFeesData(data);
  }, [data]);

  const registrationFeestemplate = {
    description: "",
    conference_id: conference_id,
    feecategories: [],
  };

  const handleRefreshFees = (fee) => {
    const targetedFee = feesData.find((f) => f.id === fee.id);
    if (!targetedFee) {
      setFeesData([...feesData, fee]);
    } else {
      setFeesData((prev) => {
        return prev.map((f) => {
          if (f.id === fee.id) {
            return fee;
          } else {
            return f;
          }
        });
      });
    }
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
      <h2 className="title secondary">Registration fees</h2>
      {dataToSend ? (
        <FeesModal
          data={dataToSend}
          close={() => setDataToSend(null)}
          refreshFunction={handleRefreshFees}
        />
      ) : null}
      {confirmation.display ? (
        <ConfirmationModal
          handleAction={() => handleDeleteFees(confirmation.id)}
          text="Are you sure to delete these registration fees ?"
          textAction="Delete"
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
      <button
        className="button"
        onClick={() => setDataToSend(registrationFeestemplate)}
      >
        New registration fees
      </button>
    </div>
  );
}
