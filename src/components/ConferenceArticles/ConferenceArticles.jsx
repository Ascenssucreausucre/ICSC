import "./ConferenceArticles.css";
import ArticleList from "../ArticleList/ArticleList";

export default function ConferenceArticles({ data, conference_id, refetch }) {
  return (
    <section className="conference-articles admin-section">
      <h1 className="title secondary">Articles</h1>
      <ArticleList
        data={data}
        conference_id={conference_id}
        refetch={refetch}
        placeholder="Search articles or authors"
      />
    </section>
  );
}
