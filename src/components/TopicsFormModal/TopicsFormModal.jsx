import { useState } from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Input } from "../Input/Input";
import { Trash2 } from "lucide-react";
import "./TopicsFormModal.css";
import useSubmit from "../../hooks/useSubmit";

export default function TopicsFormModal({
  data,
  close,
  refreshFunction,
  conference_id,
}) {
  const { submit } = useSubmit();

  const [content, setContent] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    id: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({ title: data.title, id: data.id });
      setContent(data.content);
    } else {
      setFormData({ title: "", conference_id: conference_id });
      setContent([]);
    }
  }, [data]);

  const addContent = () => {
    setContent([...content, ""]);
  };

  const handleContentChange = (index, value) => {
    const updatedSubtopics = [...content];
    updatedSubtopics[index] = value;
    setContent(updatedSubtopics);
  };

  const removeContent = (index) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ...formData,
      content: content,
    };
    const method = dataToSend.id ? "PUT" : "POST";
    const submit_url = dataToSend.id
      ? `/Topics/update/${dataToSend.id}`
      : "/Topics/create";
    const response = await submit({
      method: method,
      data: dataToSend,
      url: submit_url,
    });
    refreshFunction
      ? response.id
        ? refreshFunction({ ...dataToSend, id: response.id })
        : refreshFunction(dataToSend)
      : null;
    if (response) {
      close();
    }
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
        className="committee-form"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>{data ? data.title : "New topic"}</h1>
        <form>
          <Input
            value={formData.title}
            label="Topic title"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            name="title"
            placeholder="Topic title"
          />
          <div className="form-content">
            {content.map((subtopic, index) => (
              <div className="subtopic-input" key={index}>
                <Input
                  value={subtopic}
                  label={`Subtopic - ${index + 1}`}
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  name={`subtopic-${index}`}
                  placeholder="Topic title"
                  className="flex-1"
                />

                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeContent(index)}
                >
                  <Trash2 color="#ffffff" />
                </button>
              </div>
            ))}
          </div>
        </form>
        <button className="add-button button" onClick={addContent}>
          Add subtopic
        </button>
        <div className="button-container">
          <button className="button" onClick={handleSubmit}>
            {data ? "Update" : "Create topic"}
          </button>
          <button className="cancel-button" onClick={close}>
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
