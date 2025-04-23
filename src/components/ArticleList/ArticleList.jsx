import { useState, useEffect, useRef } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import React from "react";
import "./ArticleList.css"; // Vous devrez créer ce fichier CSS
import SearchBar from "../SearchBar/SearchBar";
import { Dropdown } from "primereact/dropdown";
import useSubmit from "../../hooks/useSubmit";
import { useAdminModal } from "../../context/AdminModalContext";
import Pagination from "../Pagination/Pagination";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import { Link } from "react-router-dom";

export default function ArticleList({ data, conference_id, refetch }) {
  const [articles, setArticles] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmation, setConfirmation] = useState({
    confirm: false,
    id: null,
  });
  const { submit } = useSubmit();
  const { openModal } = useAdminModal();

  const [pageListHeight, setPageListHeight] = useState(null);
  const articleListRef = useRef(null);

  useEffect(() => {
    if (articleListRef.current)
      setPageListHeight(
        articleListRef.current.querySelector(".page-list")?.clientHeight
      );
  }, []);

  useEffect(() => {
    if (data) {
      setArticles(data);
      setFilteredArticles(data);
      setStatusList(
        data.map((article) => {
          return { articleId: article.id, status: article.status };
        })
      );
    }
  }, [data]);

  useEffect(() => {
    const search = searchItem.toLowerCase();

    const results = articles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(search);
      const authorMatch = article.authors?.some((author) => {
        return (
          author.name?.toLowerCase().includes(search) ||
          author.surname?.toLowerCase().includes(search)
        );
      });

      return titleMatch || authorMatch;
    });

    setFilteredArticles(results);
    setCurrentPage(1); // Reset page when search changes
  }, [searchItem, articles]);

  useEffect(() => {
    const search = searchItem.toLowerCase();

    const results = articles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(search);
      const authorMatch = article.authors?.some((author) => {
        return (
          author.name?.toLowerCase().includes(search) ||
          author.surname?.toLowerCase().includes(search)
        );
      });

      return titleMatch || authorMatch;
    });

    setFilteredArticles(results);
  }, [articles]);

  const itemsPerPage = 6;

  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleSetStatus = async (id, status) => {
    const response = await submit({
      url: `/Articles/${id}/update-status`,
      method: "PUT",
      data: { status: status },
    });
    if (response.error) return;
    refetch();
  };

  const isStatusUpToDate = (id, status) => {
    const article = statusList.find((article) => article.articleId === id);
    return article?.status === status;
  };

  const handleAddArticle = async () => {
    const articleTemplate = {
      nr: 0,
      title: "",
      affiliation: "",
      conference_id: conference_id,
      authors: [],
    };

    openModal({
      initialData: articleTemplate,
      method: "POST",
      url: `/Articles`,
      title: "New article",
      memberUrl: "/Authors",
      refreshFunction: refetch,
    });
  };

  const handleUpdateArticle = (article) => {
    openModal({
      url: `/Articles/update/${article.id}`,
      method: "PUT",
      initialData: article,
      title: "Update article " + article.title,
      memberUrl: "/Authors",
      refreshFunction: refetch,
    });
  };

  const handleDeleteArticle = (id) => {
    submit({
      url: `/Articles/delete/${id}`,
      method: "DELETE",
    });
    if (refetch) refetch();
  };

  return (
    <div className="article-list" ref={articleListRef}>
      {confirmation.confirm ? (
        <ConfirmationModal
          handleAction={() => handleDeleteArticle(confirmation.id)}
          text={"Are you sure to delete this article ?"}
          textAction={"Delete"}
          unShow={(unShow) =>
            setConfirmation({ ...confirmation, confirm: unShow })
          }
        />
      ) : null}
      <SearchBar
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        placeholder="Search article or author"
      />

      {articles.length > 0 ? (
        <p>Total of {articles.length} articles found.</p>
      ) : (
        <p>No articles found.</p>
      )}

      <div
        className="article-container page-list"
        style={{ minHeight: pageListHeight + "px" }}
      >
        {paginatedArticles.length > 0 ? (
          paginatedArticles.map((article) => (
            <div className="article-card card" key={article.id}>
              <div className="flex-1">
                <h2>{article.title}</h2>
                <p className="data-detail">
                  {article.authors?.length > 0 ? (
                    <>
                      by{" "}
                      {article.authors.map((author, index) => (
                        <React.Fragment key={author.id}>
                          <Link to={`/admin/authors/${author.id}`}>
                            {author.name} {author.surname}
                          </Link>
                          {index < article.authors.length - 1 ? ", " : "."}
                        </React.Fragment>
                      ))}
                    </>
                  ) : (
                    "No authors found for this article."
                  )}
                </p>
              </div>
              <div className="button-container card-button">
                <Dropdown
                  value={article.status}
                  options={statusOptions}
                  onChange={(e) => {
                    const updatedArticles = articles.map((a) =>
                      a.id === article.id ? { ...a, status: e.value } : a
                    );
                    setArticles(updatedArticles);
                  }}
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
              <div className="button-container" style={{ width: "100%" }}>
                <button
                  className="button"
                  onClick={() => handleUpdateArticle(article)}
                >
                  Edit
                </button>
                <button
                  className="button"
                  onClick={() =>
                    setConfirmation({ confirm: true, id: article.id })
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No matching articles found.</p>
        )}
      </div>

      <div className="button-container">
        <button className="button" onClick={handleAddArticle}>
          Add an article
        </button>
      </div>

      <Pagination
        totalItems={filteredArticles.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
