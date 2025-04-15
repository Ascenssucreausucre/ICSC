import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../Input/Input";
import { useFeedback } from "../../context/FeedbackContext";
import { useAdminModal } from "../../context/AdminModalContext";
import useSubmit from "../../hooks/useSubmit";
import "./AdminFormModal.css";

export default function AdminFormModal() {
  const { modalData, closeModal } = useAdminModal();
  const { submit, submitLoading } = useSubmit();
  const [formData, setFormData] = useState(modalData?.initialData || {});

  // Met à jour le formulaire si modalData change
  useEffect(() => {
    setFormData(modalData?.initialData || {});
  }, [modalData]);

  if (!modalData) return null; // Si le modalData est null, ne rien afficher

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "file"
          ? files[0]
          : type === "date"
          ? new Date(value)
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let dataToSend;

    if (formData.image instanceof File || formData.banner instanceof File) {
      dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
    } else {
      dataToSend = formData;
    }

    const response = await submit({
      url: modalData.url,
      method: modalData.method,
      data: dataToSend,
      isFormData:
        formData.image instanceof File || formData.banner instanceof File,
    });
    if (response.error) {
      return;
    }
    if (modalData.refreshFunction) {
      modalData.refreshFunction(
        modalData.arg ? response?.newItem ?? formData : null
      );
    }
    closeModal();
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ") // Remplace les underscores par des espaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Met la première lettre de chaque mot en majuscule
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="edit-form"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="secondary">{modalData.title}</h1>
        <form onSubmit={handleSubmit}>
          {/* Génération automatique des inputs */}
          {Object.keys(formData).map((key) => {
            let value = formData[key] || "";

            if (formData[key] instanceof Date) {
              value = formData[key].toISOString().split("T")[0];
            }

            let inputType = null;
            if (formData[key] instanceof Date) {
              inputType = "date";
            } else if (typeof formData[key] === "number") {
              inputType = "number";
            } else if (key === "image" || key === "banner") {
              // Détection manuelle par clé ou type si tu veux être plus dynamique
              inputType = "file";
            } else if (key === "content") {
              inputType = "textarea";
            }

            return (
              <Input
                key={key}
                name={key}
                onChange={handleChange}
                value={inputType === "file" ? undefined : value} // Ne pas forcer value pour file
                placeholder={formatLabel(key)}
                label={formatLabel(key)}
                type={inputType}
              />
            );
          })}

          <div className="button-container">
            <button type="submit" className="button" disabled={submitLoading}>
              {submitLoading
                ? "Processing..."
                : modalData.method === "POST"
                ? "Create"
                : "Update"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
