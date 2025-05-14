import { useEffect } from "react";
import { useState } from "react";
import ImportantDates from "../ImportantDates/ImportantDates";
import "./ImportantDatesManager.css";
import { useAdminModal } from "../../context/AdminModalContext";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import useSubmit from "../../hooks/useSubmit";

export default function ImportantDatesManager({ data, conference_id }) {
  const [importantDates, setImportantDates] = useState();
  const [confirmation, setConfirmation] = useState(false);
  const { openModal } = useAdminModal();
  const { submit } = useSubmit();

  const importantDatesTemplate = {
    initial_submission_due: new Date(),
    paper_decision_notification: new Date(),
    final_submission_due: new Date(),
    registration: new Date(),
    congress_opening: new Date(),
    congress_closing: new Date(),
    conference_id: conference_id,
  };

  useEffect(() => {
    if (data) {
      const convertedDates = {
        conference_id: data.conference_id,
        initial_submission_due: new Date(data.initial_submission_due),
        paper_decision_notification: new Date(data.paper_decision_notification),
        final_submission_due: new Date(data.final_submission_due),
        registration: new Date(data.registration),
        congress_opening: new Date(data.congress_opening),
        congress_closing: new Date(data.congress_closing),
      };
      setImportantDates(convertedDates);
    }
  }, [data]);

  const refresh = (newDates) => {
    const formattedNewdates = {
      initial_submission_due: new Date(newDates.initial_submission_due),
      paper_decision_notification: new Date(
        newDates.paper_decision_notification
      ),
      final_submission_due: new Date(newDates.final_submission_due),
      registration: new Date(newDates.registration),
      congress_opening: new Date(newDates.congress_opening),
      congress_closing: new Date(newDates.congress_closing),
    };
    setImportantDates({ ...formattedNewdates, conference_id });
  };

  const handleEditDates = () => {
    openModal({
      initialData: importantDates,
      method: "PUT",
      url: `/ImportantDates/update/${importantDates.conference_id}`,
      title: `Edit important dates`,
      arg: true,
      refreshFunction: refresh,
    });
  };

  const handleCreateDates = () => {
    openModal({
      initialData: importantDatesTemplate,
      method: "POST",
      url: `/ImportantDates/`,
      title: `Create important dates`,
      arg: true,
      refreshFunction: refresh,
    });
  };

  const handleDeleteDates = () => {
    submit({
      url: `/ImportantDates/delete/${importantDates.conference_id}`,
      method: "DELETE",
    });
    setImportantDates(null);
  };

  return (
    <div className="important-date-manager admin-section">
      {confirmation ? (
        <ConfirmationModal
          handleAction={handleDeleteDates}
          text="Are you sure to delete important dates for this conference ?"
          unShow={setConfirmation}
        />
      ) : null}
      <h2 className="title secondary">Important dates</h2>
      {importantDates ? (
        <>
          <ImportantDates data={importantDates} />
          <div className="button-container">
            <button className="button small" onClick={handleEditDates}>
              Edit
            </button>
            <button
              className="button small"
              onClick={() => setConfirmation(true)}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <p style={{ marginBlock: "5px" }}>
          No important dates yet for this conference.
        </p>
      )}
      <div className="button-container">
        <button
          className="button"
          disabled={!!importantDates}
          onClick={handleCreateDates}
        >
          Add important dates
        </button>
      </div>
    </div>
  );
}
