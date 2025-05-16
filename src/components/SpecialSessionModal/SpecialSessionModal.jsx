import { motion } from "framer-motion";
import { Input } from "../Input/Input";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import MembersList from "../MembersList/MembersList";
import "./SpecialSessionModal.css";
import useSubmit from "../../hooks/useSubmit";

export default function SpecialSessionModal({ data, close, refetch }) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    conference_id: "",
  });
  const [formAuthors, setFormAuthors] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const { submit } = useSubmit();

  useEffect(() => {
    if (data) {
      const { title, summary, conference_id, authors, id } = data;

      setFormData({
        title,
        summary,
        conference_id,
        ...(id && { id }),
      });

      setFormAuthors(authors || []);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAuthor = (author) => {
    setFormAuthors((prev) => {
      if (prev.some((a) => a.id === author.id)) return prev;
      return [...prev, author];
    });
  };

  const handleDeleteAuthor = (id) => {
    setFormAuthors(formAuthors.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { id, ...dataToSend } = formData;
    const response = await submit({
      url: `/special-sessions/${id ? id : ""}`,
      method: id ? "PUT" : "POST",
      data: { ...dataToSend, authors: formAuthors },
    });
    setLoading(false);
    if (!response) {
      return;
    }
    refetch && refetch();
    close && close();
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
        {showList && (
          <MembersList
            url={`/authors/`}
            addMember={handleAddAuthor}
            close={() => setShowList(false)}
          />
        )}
        <form onSubmit={handleSubmit}>
          <h2>
            {data?.id ? "Update special session" : "Create special session"}
          </h2>
          <Input
            placeholder="Title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            placeholder="Summary"
            label="Summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          />
          <div className="form-authors">
            {formAuthors.map((author) => (
              <div key={author.id} className="author-item">
                <p>{`${author.title ? author.title + " " : ""}${author.name} ${
                  author.surname
                }`}</p>{" "}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteAuthor(author.id)}
                >
                  <Trash2 />
                </button>
              </div>
            ))}
          </div>
          <button
            className="button"
            type="button"
            onClick={() => {
              setShowList(true);
            }}
          >
            Add authors
          </button>
          <div className="button-container">
            <button className="button" type="submit">
              {loading ? "Submitting..." : data?.id ? "Update" : "Create"}
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
