import { useAdminModal } from "../../context/AdminModalContext";
import "./ConfirmationModal.css";

import { motion } from "framer-motion";

export default function ConfirmationModal() {
  const { confirmationModalData, closeConfirmationModal } = useAdminModal();

  const handleActionUnShow = () => {
    confirmationModalData.handleAction();
    closeConfirmationModal();
  };
  if (!confirmationModalData) {
    return null;
  }
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="confirmation-modal"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2>{confirmationModalData.text}</h2>
        <div className="button-container">
          <button className="button" onClick={handleActionUnShow}>
            {confirmationModalData.textAction || "Delete"}
          </button>
          <button onClick={closeConfirmationModal} className="cancel-button">
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
