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

  // Met à jour le formulaire si modalData change
  useEffect(() => {
    if (modalData?.initialData) {
      const { conference_id, id, ...initialData } = modalData.initialData;
      setFormData(initialData || {});
      setConferenceId(conference_id);
    }
  }, [modalData]);

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
        // Tu peux stocker ce template dans un state, par exemple :
        setObjectArrayTemplate(objectTemplate);
        break; // On s'arrête au premier tableau d'objets trouvé
      }
    }
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

    // if (firstItem && typeof firstItem === "object") {
    //   Object.keys(firstItem).forEach((k) => {
    //     newItem[k] = typeof firstItem[k] === "object" ? {} : "";
    //   });
    // }
    newArray.push(newItem);
    setFormData((prev) => ({ ...prev, [key]: newArray }));
  };

  const addExistingObjectToArray = (item) => {
    const newArray = [...(formData[key] || [])];
    const newItem = objectArrayTemplate ? objectArrayTemplate : {}; // Crée un objet vide ou avec des valeurs par défaut
    const firstItem = formData[key]?.[0];
    if (firstItem && typeof firstItem === "object") {
      Object.keys(firstItem).forEach((k) => {
        newItem[k] = typeof firstItem[k] === "object" ? {} : "";
      });
    }
    newArray.push(newItem);
    setFormData((prev) => ({ ...prev, [key]: newArray }));
  };

  const removeObjectFromArray = (key, index) => {
    const newArray = [...formData[key]];
    newArray.splice(index, 1);
    setFormData((prev) => ({ ...prev, [key]: newArray }));
  };

  // Solution: Modifier la fonction handleSubmit pour normaliser les dates

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créez une copie de formData pour pouvoir modifier les dates
    const processedData = { ...formData };

    // Traitez les dates pour les normaliser
    for (const key in processedData) {
      // Vérifiez si la valeur est un objet Date
      if (processedData[key] instanceof Date) {
        // Option 1: Pour envoyer des chaînes ISO (format standard)
        processedData[key] = processedData[key].toISOString();

        // OU Option 2: Pour conserver le format de date affiché à l'utilisateur
        // processedData[key] = processedData[key].toISOString().split('T')[0];
      }
    }

    let dataToSend;

    if (
      processedData.image instanceof File ||
      processedData.banner instanceof File ||
      processedData.file instanceof File ||
      processedData.additionnal_file instanceof File
    ) {
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
      isFormData:
        processedData.image instanceof File ||
        processedData.file instanceof File ||
        processedData.banner instanceof File ||
        processedData.additionnal_file instanceof File,
    });

    if (response.error) {
      return;
    }

    if (modalData.refreshFunction) {
      modalData.refreshFunction(
        modalData.arg ? response?.newItem ?? processedData : null
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

            if (Array.isArray(value)) {
              return (
                <div key={key}>
                  <label className="array-label">{formatLabel(key)}</label>
                  <div key={key} className="object-array-field">
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
                    {/* <button
                      type="button"
                      onClick={() => addObjectToArray(key)}
                      className="small button"
                    >
                      + Add {formatLabel(key)}
                    </button> */}
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

            let inputType = null;
            if (formData[key] instanceof Date) {
              inputType = "date";
            } else if (typeof formData[key] === "number") {
              inputType = "number";
            } else if (
              key === "image" ||
              key === "banner" ||
              key === "file" ||
              key === "additionnal_file"
            ) {
              inputType = "file";
            } else if (key === "content" || key === "text") {
              inputType = "textarea";
            } else if (/color/i.test(key)) {
              inputType = "color";
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
              onClick={() => {
                setShowList(false), closeModal();
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
