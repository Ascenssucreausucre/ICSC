import { Link, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export default function User({}) {
  const { id } = useParams();
  const {
    data: user,
    error,
    refetch,
    loading,
  } = useFetch(`/user/profile/${id}`);

  console.log(user);
  return (
    <section className="admin-section">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <p>Error while retreiving author's informations: {error}</p>
      ) : (
        <>
          <h1 className="title secondary">{`${user.name} ${user.surname}`}</h1>
          <h3>
            Linked author:{" "}
            {user?.author ? (
              <Link to={`/admin/authors/${user.author.id}`}>
                {user.author.name} {user.author.surname}
              </Link>
            ) : (
              "None"
            )}
          </h3>
        </>
      )}
    </section>
  );
}
