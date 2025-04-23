import { useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import ArticleList from "../../../components/ArticleList/ArticleList";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function Author() {
  const { id } = useParams();

  const { data: author, loading, error, refetch } = useFetch(`/Authors/${id}`);

  return (
    <div className="single-author admin-section">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <p className="white">An error has occured : {error}</p>
      ) : (
        <>
          <h1 className="secondary">{`${author?.title ? author.title : ""} ${
            author.name
          } ${author.surname}`}</h1>
          <ArticleList data={author.articles} refetch={refetch} />
        </>
      )}
    </div>
  );
}
