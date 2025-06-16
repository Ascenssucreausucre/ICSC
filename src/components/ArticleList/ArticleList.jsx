import { useState, useEffect, useRef } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import "./ArticleList.css"; // Vous devrez créer ce fichier CSS
import SearchBar from "../SearchBar/SearchBar";
import { Dropdown } from "primereact/dropdown";
import useSubmit from "../../hooks/useSubmit";
import { useAdminModal } from "../../context/AdminModalContext";
import Pagination from "../Pagination/Pagination";
import Article from "../Article/Article";

export default function ArticleList({
  data,
  conference_id,
  refetch,
  filters = true,
  placeholder,
}) {
  const [articles, setArticles] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [profileFilter, setProfileFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const { submit } = useSubmit();
  const { openModal, openConfirmationModal } = useAdminModal();

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

    // 1. Filtrer par titre ou auteur
    let results = articles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(search);
      const authorMatch = article.authors?.some((author) => {
        return (
          author.name?.toLowerCase().includes(search) ||
          author.surname?.toLowerCase().includes(search)
        );
      });
      return titleMatch || authorMatch;
    });

    // 2. Filtrer par profil si nécessaire
    if (profileFilter) {
      results = results.filter(
        (el) => el.profile?.toLowerCase() === profileFilter.toLowerCase()
      );
    }

    if (statusFilter) {
      results = results.filter(
        (el) => el.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // 3. Mettre à jour la liste filtrée et reset la pagination
    setFilteredArticles(results);
    setCurrentPage(1);
  }, [searchItem, articles, profileFilter, statusFilter]);

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
      url: `/articles/${id}/update-status`,
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

  const handleAddNonExistantAuthor = () => {
    openModal({
      url: "/authors/",
      method: "POST",
      initialData: {
        name: "",
        surname: "",
        country: "",
        title: "",
        affiliation: "",
      },
      title: "Create author",
    });
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
      url: `/articles`,
      title: "New article",
      memberUrl: "/Authors",
      refreshFunction: refetch,
      unexists: handleAddNonExistantAuthor,
    });
  };

  const handleUpdateArticle = (article) => {
    const { status, ...articleRows } = article;
    openModal({
      url: `/articles/update/${article.id}`,
      method: "PUT",
      initialData: articleRows,
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

  const handleChange = (e, article) => {
    const updatedArticles = articles.map((a) =>
      a.id === article.id ? { ...a, status: e.value } : a
    );
    setArticles(updatedArticles);
  };

  const handleAddArticleByFile = async () => {
    openModal({
      url: "/articles/add-by-file",
      method: "POST",
      initialData: { file: "", conferenceId: conference_id },
      title: "Add bulk articles (.xlsx, .xls)",
      subtitle: (
        <>
          Make sure to only have the newest articles in your file, the process
          might be longer in the other case. The excel file must contain at
          least (with this exact synthax):
          <ul>
            <li style={{ paddingInlineStart: "1rem" }}>
              - for Authors: Author, Affiliation, Country, PIN
            </li>
            <li style={{ paddingInlineStart: "1rem" }}>
              - for Articles: Title, Type, Nr, Status
            </li>
            <li style={{ paddingInlineStart: "1rem" }}>
              - Status has to be: Accepted or Rejected, other statuses will
              result on "Pending"
            </li>
            <li style={{ paddingInlineStart: "1rem" }}>
              - Type has to be: "Contributed Paper" in order to result on
              "Contributed", anything else will result on "Invited"
            </li>
            <li style={{ paddingInlineStart: "1rem" }}>
              - Each row has to be related to only one article and author
            </li>
          </ul>
          <a href="/files/excel-template.xlsx" className="link">
            Example template
          </a>
        </>
      ),
      refreshFunction: refetch,
    });
  };

  return (
    <div className="article-list" ref={articleListRef}>
      <SearchBar
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        placeholder={placeholder}
      />

      <div className="filters-row">
        <Dropdown
          value={profileFilter}
          onChange={(e) => setProfileFilter(e.target.value)}
          options={["Contributed", "Invited"]}
          placeholder="Select profile"
          showClear
        />
        <Dropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={["Pending", "Accepted", "Rejected"]}
          placeholder="Select Status"
          showClear
        />
        <button
          className="button small"
          onClick={() => {
            setStatusFilter(null), setProfileFilter(null);
          }}
        >
          Clear Filters
        </button>
      </div>

      {articles.length > 0 ? (
        <p>Total of {filteredArticles.length} articles found.</p>
      ) : (
        <p>No articles found.</p>
      )}

      <div
        className="article-container page-list"
        style={{ minHeight: pageListHeight + "px" }}
      >
        {paginatedArticles.length > 0 ? (
          paginatedArticles.map((article) => (
            <Article
              article={article}
              onChange={handleChange}
              statusOptions={statusOptions}
              statusItemTemplate={statusItemTemplate}
              selectedStatusTemplate={selectedStatusTemplate}
              isStatusUpToDate={isStatusUpToDate}
              handleUpdateArticle={handleUpdateArticle}
              handleSetStatus={handleSetStatus}
              handleDeleteArticle={handleDeleteArticle}
              openConfirmationModal={openConfirmationModal}
              key={article.id}
            />
          ))
        ) : (
          <p>No matching articles found.</p>
        )}
      </div>

      <Pagination
        totalItems={filteredArticles.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <div className="button-container">
        <button className="button" onClick={handleAddArticle}>
          Add an article
        </button>
        <button className="button" onClick={handleAddArticleByFile}>
          Add by file
        </button>
      </div>
    </div>
  );
}
