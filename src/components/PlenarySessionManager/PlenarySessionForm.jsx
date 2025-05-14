import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../Input/Input";
import useSubmit from "../../hooks/useSubmit";
import AuthorDropdown from "../AuthorDropDown";
import "./PlenarySessionManager.css";

export default function PlenarySessionForm({ data, close, refetch }) {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { submit } = useSubmit();

  useEffect(() => {
    if (data) {
      const {
        title = "",
        image = "",
        affiliation = "",
        author_resume = "",
        authors = [],
        session_resume = "",
        id = null,
        conference_id = null,
      } = data;

      const firstAuthorId = authors.length > 0 ? authors[0].id : undefined;

      setFormData({
        title,
        image,
        affiliation,
        author_resume,
        authors: { id: firstAuthorId },
        session_resume,
        id,
        conference_id,
      });
    }
  }, [data]);

  useEffect(() => {
    if (formData) console.log(formData.authors.id);
  }, [formData]);

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
    setIsLoading(true);

    const dataToSend = new FormData();

    for (const key in formData) {
      const value = formData[key];

      if (key === "authors") {
        // Si c’est un tableau ou un objet, on stringify
        dataToSend.append(key, JSON.stringify(value));
      } else {
        dataToSend.append(key, value);
      }
    }

    const response = await submit({
      url: `/plenary-sessions/${formData?.id ? formData.id : ""}`,
      method: formData?.id ? "PUT" : "POST",
      data: dataToSend,
      isFormData: true,
    });

    if (!response) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    refetch();
    close();
  };

  if (!formData) {
    return;
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
        className="edit-form"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="title secondary">
          {formData?.id ? "Edit" : "Create"} plenary session
        </h2>
        <form>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            label="Title"
          />
          <div className="form-input">
            <label htmlFor="">Author</label>
            <AuthorDropdown
              value={formData.authors.id}
              onChange={(newAuthorId) => {
                setFormData((prev) => ({
                  ...prev,
                  authors: { id: newAuthorId }, // <- on sauvegarde juste l'ID de l'auteur
                }));
              }}
            />
          </div>
          <Input
            name="affiliation"
            value={formData.affiliation}
            onChange={handleChange}
            placeholder="Affiliation"
            label="Affiliation"
          />
          <Input
            name="image"
            value={undefined}
            onChange={handleChange}
            placeholder="Image"
            label="Image"
            type="file"
          />
          <Input
            name="author_resume"
            value={formData.author_resume}
            onChange={handleChange}
            placeholder="Author's resume"
            label="Author's resume"
            type="textarea"
          />
          <Input
            name="session_resume"
            value={formData.session_resume}
            onChange={handleChange}
            placeholder="Session's resume"
            label="Session's resume"
            type="textarea"
          />
          <div className="button-container">
            <button
              className="button small"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
            <button className="cancel-button" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
