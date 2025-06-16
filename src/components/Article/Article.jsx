import React from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import "./Article.css";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function Article({
  article,
  onChange,
  statusOptions,
  statusItemTemplate,
  selectedStatusTemplate,
  isStatusUpToDate,
  handleUpdateArticle,
  handleDeleteArticle,
  handleSetStatus,
  openConfirmationModal,
}) {
  const statusIcons = {
    pending: { Icon: Clock, className: "icon-pending" },
    accepted: { Icon: CheckCircle, className: "icon-accepted" },
    rejected: { Icon: XCircle, className: "icon-rejected" },
  };
  const { Icon, className } = statusIcons[article.status.toLowerCase()] || {};
  const formatText = (text) =>
    String(text).charAt(0).toUpperCase() + String(text).slice(1);
  return (
    <div className={`article-card card ${article.status}`} key={article.id}>
      <div className="flex-1 text-card">
        <div className="grouped-title flex-1">
          <h2 className="card-title">{article.title}</h2>
          <p className="data-detail">
            {article.authors?.length > 0 ? (
              <>
                by{" "}
                {article.authors.map((author, index) => (
                  <React.Fragment key={author.id}>
                    {onChange ? (
                      <Link to={`/admin/authors/${author.id}`}>
                        {author.name} {author.surname}
                      </Link>
                    ) : (
                      <>
                        {author.name} {author.surname}
                      </>
                    )}
                    {index < article.authors.length - 1 ? ", " : "."}
                  </React.Fragment>
                ))}
              </>
            ) : (
              "No authors found for this article."
            )}
          </p>
        </div>
        <div className="tag-container">
          <div className={`tag tag-${article.profile.toLowerCase()}`}>
            {article.profile}
          </div>
          {!onChange && (
            <div className={`tag tag-${article.status.toLowerCase()}`}>
              <p>{formatText(article.status)}</p>
            </div>
          )}
        </div>
      </div>
      {onChange && (
        <div className="button-container card-button-container">
          <Dropdown
            value={article.status}
            options={statusOptions}
            onChange={(e) => onChange(e, article)}
            placeholder="Select status"
            className={`status-dropdown status-${article.status}`}
            optionLabel="label"
            itemTemplate={statusItemTemplate}
            valueTemplate={selectedStatusTemplate}
          />
          <button
            className="button small"
            onClick={() => handleSetStatus(article.id, article.status)}
            disabled={isStatusUpToDate(article.id, article.status)}
          >
            Save
          </button>
        </div>
      )}
      {onChange && (
        <div className="button-container" style={{ width: "100%" }}>
          <button
            className="button small"
            onClick={() => handleUpdateArticle(article)}
          >
            Edit
          </button>
          <button
            className="button small"
            onClick={() =>
              openConfirmationModal({
                text: "Are you sure to delete this article ?",
                handleAction: () => handleDeleteArticle(article.id),
              })
            }
          >
            Delete
          </button>
        </div>
      )}
      {Icon && !onChange && (
        <Icon
          size={24}
          className={className}
          style={{ marginLeft: "0.2rem" }}
        />
      )}
    </div>
  );
}
