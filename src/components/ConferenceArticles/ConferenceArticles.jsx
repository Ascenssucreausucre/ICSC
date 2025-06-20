import "./ConferenceArticles.css";
import ArticleList from "../ArticleList/ArticleList";
import { useState } from "react";
import { Chips } from "primereact/chips";
import { Dropdown } from "primereact/dropdown";
import { XCircle, CheckCircle, Clock } from "lucide-react";
import { FloatLabel } from "primereact/floatlabel";
import { useEffect } from "react";
import { useRef } from "react";
import useSubmit from "../../hooks/useSubmit";

export default function ConferenceArticles({ data, conference_id, refetch }) {
  const [articleIds, setArticleIds] = useState([]);
  const [action, setAction] = useState({ label: "Pending", value: "pending" });
  const [inputText, setInputText] = useState("");
  const { submit, submitLoading } = useSubmit();

  const inputRef = useRef(null);

  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    const handleInput = (e) => {
      setInputText(e.target.value);
    };

    inputEl.addEventListener("input", handleInput);
    return () => {
      inputEl.removeEventListener("input", handleInput);
    };
  }, []);

  const handleChipsChange = (e) => {
    setArticleIds(e.target.value);
    setInputText("");
  };

  const handleStatusChange = (value) => {
    const currentStatus = statusOptions.find(
      (status) => status.value === value
    );
    setAction(currentStatus);
  };

  const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
  ];

  const statusItemTemplate = (option) => {
    switch (option.value) {
      case "pending":
        return (
          <div className="status-option">
            <Clock size={16} className="icon-pending" /> Pending
          </div>
        );
      case "accepted":
        return (
          <div className="status-option">
            <CheckCircle size={16} className="icon-accepted" /> Accepted
          </div>
        );
      case "rejected":
        return (
          <div className="status-option">
            <XCircle size={16} className="icon-rejected" /> Rejected
          </div>
        );
      default:
        return option.label;
    }
  };

  const selectedStatusTemplate = (option) => {
    if (!option) return "Select status"; // fallback

    return statusItemTemplate(option);
  };

  const handleSubmit = async () => {
    const dataToSend = {
      ids: articleIds,
      status: action.value,
      conferenceId: conference_id,
    };
    const response = await submit({
      url: "/articles/update-status",
      method: "PUT",
      data: dataToSend,
    });

    if (response) {
      refetch();
    }
  };

  return (
    <section className="conference-articles admin-section">
      <h2 className="title secondary">Articles</h2>
      <ArticleList
        data={data}
        conference_id={conference_id}
        refetch={refetch}
        placeholder="Search articles or authors"
      />
      <div className="grouped-actions-container">
        <h2 className="title secondary">Grouped actions</h2>
        <FloatLabel>
          <label
            htmlFor="article-id"
            className={`${
              articleIds.length > 0 || inputText.length > 0 ? " active" : ""
            }`}
          >
            Enter the article-nr you want to edit
          </label>
          <Chips
            value={articleIds}
            onChange={handleChipsChange}
            inputId="article-id"
            inputRef={inputRef}
          />
        </FloatLabel>
        <p className={`input-infos${articleIds.length > 0 ? " active" : ""}`}>
          Articles to update: {articleIds.length}
          {!submitLoading && articleIds.length > 0 && (
            <button onClick={() => setArticleIds([])}>Reset</button>
          )}
        </p>
        <div className="button-container">
          <Dropdown
            value={action.value}
            options={statusOptions}
            onChange={(e) => {
              handleStatusChange(e.target.value);
            }}
            placeholder="Select status"
            className={`status-dropdown status-${action.value}`}
            optionLabel="label"
            itemTemplate={statusItemTemplate}
            valueTemplate={selectedStatusTemplate}
          />
          <button
            className="button"
            onClick={handleSubmit}
            disabled={submitLoading || articleIds.length === 0}
          >
            {submitLoading ? "Submitting..." : "Set status"}
          </button>
        </div>
      </div>
    </section>
  );
}
