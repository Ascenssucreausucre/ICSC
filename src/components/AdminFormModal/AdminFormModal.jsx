import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../Input/Input";
import { useFeedback } from "../../context/FeedbackContext";
import { useAdminModal } from "../../context/AdminModalContext";
import useSubmit from "../../hooks/useSubmit";
import "./AdminFormModal.css";
import { Trash2 } from "lucide-react";
import MembersList from "../MembersList/MembersList";

export default function AdminFormModal() {
  const { modalData, closeModal } = useAdminModal();
  const { submit, submitLoading } = useSubmit();
  const [formData, setFormData] = useState(modalData?.initialData || {});
  const [objectArrayTemplate, setObjectArrayTemplate] = useState({});
  const [showList, setShowList] = useState(false);
  const [conferenceId, setConferenceId] = useState();

  useEffect(() => {
    if (modalData?.initialData) {
      const { conference_id, conferenceId, id, ...initialData } =
        modalData.initialData;

      const processedInitialData = {};
      for (const key in initialData) {
        const value = initialData[key];
        if (value instanceof Date) {
          processedInitialData[key] = value.toISOString().split("T")[0];
        } else if (
          typeof value === "string" &&
          /^\d{4}-\d{2}-\d{2}T/.test(value)
        ) {
          processedInitialData[key] = value.split("T")[0];
        } else {
          processedInitialData[key] = value;
        }
      }
      setFormData(processedInitialData);
      setConferenceId(conference_id || conferenceId);
    }
  }, [modalData]);

  console.log(formData);

  useEffect(() => {
    if (!modalData?.initialData) return;

    const entries = Object.entries(modalData.initialData);
    for (const [key, value] of entries) {
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "object"
      ) {
        const objectTemplate = { ...value[0] };
        setObjectArrayTemplate(objectTemplate);
        break;
      }
    }
  }, [modalData]);

  if (!modalData) return null;

  const handleChange = (eOrValue, maybeName) => {
    if (eOrValue && eOrValue.target) {
      const { name, type, files, value } = eOrValue.target;
      if (!name) return;

      setFormData((prevData) => ({
        ...prevData,
        [name]:
          type === "file"
            ? files[0]
            : type === "number"
            ? Number(value)
            : value,
      }));
    } else if (maybeName) {
      setFormData((prevData) => ({
        ...prevData,
        [maybeName]: eOrValue,
      }));
    } else {
      console.warn("handleChange was called without a valid name.");
    }
  };

  const handleObjectArrayChange = (key, index, field, value) => {
    const newArray = [...formData[key]];
    newArray[index] = {
      ...newArray[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, [key]: newArray }));
  };

  const addObjectToArray = (key, item) => {
    const newArray = [...(formData[key] || [])];
    const newItem = item ? item : objectArrayTemplate;
    newArray.push(newItem);
    setFormData((prev) => ({ ...prev, [key]: newArray }));
  };

  const removeObjectFromArray = (key, index) => {
    const newArray = [...formData[key]];
    newArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: newArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const processedData = { ...formData };

    for (const key in processedData) {
      if (
        typeof processedData[key] === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(processedData[key])
      ) {
        processedData[key] = new Date(processedData[key]).toISOString();
      }
      if (!processedData[key]) {
        processedData[key] = undefined;
      }
    }

    let dataToSend;
    const isFormData =
      processedData.image instanceof File ||
      processedData.banner instanceof File ||
      processedData.file instanceof File ||
      processedData.additional_file instanceof File;

    if (isFormData) {
      dataToSend = new FormData();
      for (const key in processedData) {
        dataToSend.append(key, processedData[key]);
      }
      dataToSend.append("conference_id", conferenceId);
    } else {
      dataToSend = { ...processedData, conference_id: conferenceId };
    }

    const response = await submit({
      url: modalData.url,
      method: modalData.method,
      data: dataToSend,
      isFormData,
    });

    if (response.error) return;

    if (modalData.refreshFunction) {
      modalData.refreshFunction(
        modalData.arg ? response?.newItem ?? processedData : null
      );
    }

    closeModal();
  };

  const formatLabel = (key) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

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
        <h2 className="title secondary">{modalData.title}</h2>
        {modalData.subtitle && <p className="subtitle">{modalData.subtitle}</p>}
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => {
            let value = formData[key] !== undefined ? formData[key] : "";

            if (Array.isArray(value)) {
              return (
                <div key={key}>
                  <label className="array-label">{formatLabel(key)}</label>
                  <div className="object-array-field">
                    {value.map((item, index) => (
                      <div key={index} className="object-array-item">
                        {Object.entries(item).map(([subKey, subValue]) => {
                          if (subKey === "id") return null;
                          const inputName = `${key}-${index}-${subKey}`;
                          const subValueString =
                            typeof subValue === "object" && subValue !== null
                              ? JSON.stringify(subValue)
                              : subValue || "";

                          return (
                            <Input
                              key={inputName}
                              name={inputName}
                              value={subValueString}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  key,
                                  index,
                                  subKey,
                                  e.target.value
                                )
                              }
                              placeholder={formatLabel(subKey)}
                              label={formatLabel(subKey)}
                              disabled={!!item.id}
                            />
                          );
                        })}
                        <button
                          type="button"
                          className="remove-button"
                          onClick={() => removeObjectFromArray(key, index)}
                        >
                          <Trash2 color="#ffffff" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="button-container">
                    <button
                      type="button"
                      onClick={() => setShowList(true)}
                      className="small button"
                    >
                      + Add Existing {formatLabel(key)}
                    </button>
                    {showList && modalData?.memberUrl && (
                      <MembersList
                        url={modalData?.memberUrl}
                        addMember={(item) => {
                          addObjectToArray(key, item);
                        }}
                        close={() => setShowList(false)}
                        unexists={modalData?.unexists}
                      />
                    )}
                  </div>
                </div>
              );
            }

            // Détection du type de champ
            let inputType = null;
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
              inputType = "date";
            } else if (typeof value === "number") {
              inputType = "number";
            } else if (
              key === "image" ||
              key === "banner" ||
              key === "file" ||
              key === "additional_file"
            ) {
              inputType = "file";
            } else if (
              key === "content" ||
              key === "text" ||
              key === "description"
            ) {
              inputType = "textarea";
            } else if (key === "tel") {
              inputType = "tel";
            } else if (key === "email") {
              inputType = "email";
            } else if (/color/i.test(key)) {
              inputType = "color";
            }

            return (
              <Input
                key={key}
                name={key}
                onChange={(val) => handleChange(val, key)}
                value={inputType === "file" ? undefined : formData[key] || ""}
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
              onClick={() => {
                setShowList(false);
                closeModal();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
