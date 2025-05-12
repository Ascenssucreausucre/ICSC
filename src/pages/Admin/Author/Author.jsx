import { Link, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import ArticleList from "../../../components/ArticleList/ArticleList";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import countriesMap from "../../../assets/json/flag-countries.json";
import { SquarePen } from "lucide-react";
import "./Author.css";
import { useAdminModal } from "../../../context/AdminModalContext";
import { CircleArrowLeft } from "lucide-react";

export default function Author() {
  const { id } = useParams();

  const { openModal } = useAdminModal();

  const { data: author, loading, error, refetch } = useFetch(`/Authors/${id}`);

  const handleEditAuthor = () => {
    const { articles, ...authorData } = author;
    openModal({
      url: `/Authors/update/${author.id}`,
      method: "PUT",
      title: `Edit author ${author?.title ? author.title : ""} ${author.name} ${
        author.surname
      }`,
      initialData: authorData,
      refreshFunction: refetch,
    });
  };

  return (
    <div className="single-author admin-section">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <p className="white">An error has occured : {error}</p>
      ) : (
        <>
          <h1 className="secondary sub-page-title">
            <Link to="/admin/authors" className="back-button">
              <CircleArrowLeft size="100%" />
            </Link>
            {`${author?.title ? author.title : ""} ${author.name} ${
              author.surname
            }`}{" "}
            <SquarePen className="edit-icon" onClick={handleEditAuthor} />
          </h1>
          <h2 className="sub-title" style={{ textAlign: "center" }}>
            from{" "}
            {
              <span
                className={`flag-icon flag-icon-${countriesMap
                  .find((c) => c.name === author?.country)
                  ?.code?.toLowerCase()}`}
              />
            }{" "}
            {author.country}
          </h2>
          <ArticleList
            data={author.articles}
            refetch={refetch}
            placeholder="Browse articles"
          />
        </>
      )}
    </div>
  );
}
