import { Link, useParams } from "react-router-dom";
import { useAdminModal } from "../../context/AdminModalContext";
import "./NewsManager.css";
import { useState, useEffect, useRef } from "react";
import useSubmit from "../../hooks/useSubmit";
import { motion, AnimatePresence } from "framer-motion";
import Linkify from "linkify-react";
import Pagination from "../Pagination/Pagination"; // Import the new Pagination component
import { FileCheck2 } from "lucide-react";
import { LinkIcon } from "lucide-react";
import { FileX2 } from "lucide-react";
import { LucideUnlink } from "lucide-react";

export default function NewsManager({ news }) {
  const { id } = useParams();
  const newsTemplate = {
    conference_id: id,
    title: "",
    icon: "",
    from_date: new Date(),
    to_date: new Date(),
    content: "",
    file: "",
  };

  const { openModal } = useAdminModal();
  const { submit } = useSubmit();
  const [refreshedNews, setRefreshedNews] = useState(news);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc"); // or 'asc'
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [pageListHeight, setPageListHeight] = useState(null);

  const newsManagerRef = useRef(null);

  useEffect(() => {
    if (newsManagerRef.current) {
      setPageListHeight(
        newsManagerRef.current.querySelector(".page-list")?.clientHeight
      );
    }
  });

  const itemsPerPage = 5;

  const handleEditNews = ({ id, conference_id, ...singleNewWithoutIds }) => {
    singleNewWithoutIds.from_date = new Date(singleNewWithoutIds.from_date);
    singleNewWithoutIds.to_date = new Date(singleNewWithoutIds.to_date);

    const handleReplaceEditedNews = (arg) => {
      setRefreshedNews((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...arg } : item))
      );
    };

    openModal({
      initialData: singleNewWithoutIds,
      method: "PUT",
      url: `/News/update/${id}`,
      title: `Edit news "${singleNewWithoutIds.title}"`,
      arg: true,
      refreshFunction: handleReplaceEditedNews,
    });
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteNews = (id) => {
    setDeletingId(id);
    setTimeout(() => {
      submit({ url: `/News/delete/${id}`, method: "DELETE" });
      setRefreshedNews((prev) => prev.filter((item) => item.id !== id));
      setDeletingId(null);
    }, 1);
  };

  const handleCreateNews = () => {
    const handleAddNews = (news) => {
      setRefreshedNews((prev) => [...prev, news]);
    };
    openModal({
      initialData: newsTemplate,
      method: "POST",
      url: `/News/`,
      title: "Create a news",
      arg: true,
      refreshFunction: handleAddNews,
    });
  };

  const handleSortToggle = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Convert strings to Date objects
  const parsedFilterFrom = filterFrom ? new Date(filterFrom) : null;
  const parsedFilterTo = filterTo ? new Date(filterTo) : null;

  // Filter and sort
  const filteredNews = refreshedNews
    .filter((n) => {
      const from = new Date(n.from_date);
      if (parsedFilterFrom && from < parsedFilterFrom) return false;
      if (parsedFilterTo && from > parsedFilterTo) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.from_date);
      const dateB = new Date(b.from_date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Pagination
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="new-manager admin-section" ref={newsManagerRef}>
      <h2 className="title secondary">News</h2>

      {/* Filter + Sort */}
      <div className="filter-bar">
        <label>
          From:{" "}
          <input
            type="date"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
        </label>
        <button className="" onClick={handleSortToggle}>
          Sort: {sortOrder === "asc" ? "Oldest → Newest" : "Newest → Oldest"}
        </button>
      </div>

      {/* News Cards */}
      <div className="page-list" style={{ minHeight: pageListHeight + "px" }}>
        <AnimatePresence>
          {paginatedNews.length === 0 ? (
            <p>This conference has no news.</p>
          ) : (
            paginatedNews.map((singleNews) => {
              const isBeingDeleted = singleNews.id === deletingId;
              return (
                <motion.div
                  key={singleNews.id}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={isBeingDeleted ? { opacity: 0, scale: 0.5 } : {}}
                  transition={{ duration: 0.4, ease: "anticipate" }}
                >
                  <div className="news-card card">
                    <div className="flex-1">
                      <h2 className="card-title">{singleNews.title}</h2>
                      <p className="data-detail">
                        from{" "}
                        {new Date(singleNews.from_date).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                          }
                        )}{" "}
                        to{" "}
                        {new Date(singleNews.to_date).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="limited-height-content">
                        <Linkify options={{ target: "_blank" }}>
                          {singleNews.content}
                        </Linkify>
                      </p>
                      {singleNews?.file ? (
                        <Link
                          to={`${
                            import.meta.env.VITE_IMAGE_URL + singleNews.file
                          }`}
                          className="link"
                          target="__blank"
                          style={{
                            color: "var(--tertiary-color)",
                            width: "fit-content",
                          }}
                        >
                          <FileCheck2 className="text-icon" />
                          Attached file
                          <LinkIcon
                            className="text-icon hover-icon"
                            size="1.2rem"
                            strokeWidth="2.5"
                          />
                        </Link>
                      ) : (
                        <div
                          className="alt-link"
                          style={{
                            display: "flex",
                            color: "var(--secondary-color)",
                            alignItems: "center",
                            gap: "0.2rem",
                            width: "fit-content",
                          }}
                        >
                          <FileX2 className="text-icon" /> No attached file.{" "}
                          <LucideUnlink
                            className="text-icon hover-icon broken"
                            size="1.2rem"
                            strokeWidth="2.5"
                          />
                        </div>
                      )}
                    </div>
                    <div className="button-container card-button-container">
                      <button
                        className="button small"
                        onClick={() => handleEditNews(singleNews)}
                      >
                        Edit
                      </button>
                      <button
                        className="button small"
                        onClick={() => handleDeleteNews(singleNews.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Use the new Pagination component */}
      <Pagination
        totalItems={filteredNews.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <button className="button" onClick={handleCreateNews}>
        Add news
      </button>
    </div>
  );
}
