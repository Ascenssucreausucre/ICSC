import { Link, useParams } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { useState } from "react";
import { useEffect } from "react";
import "./User.css";
import useSubmit from "../../../hooks/useSubmit";

export default function User({}) {
  const { id } = useParams();
  const {
    data: userData,
    error,
    refetch,
    loading,
  } = useFetch(`/user/profile/${id}`);
  const { submit } = useSubmit();

  const [user, setUser] = useState("");

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  console.log(user);

  const handleUnlinkAuthor = async (id) => {
    await submit({
      url: `/user/reset-author/${id}`,
      method: "PUT",
    });
    refetch();
  };

  return (
    <section className="admin-section user-section">
      {loading && !user ? (
        <LoadingScreen />
      ) : error ? (
        <p>Error while retreiving author's informations: {error}</p>
      ) : (
        <>
          <h1 className="title secondary">{`${user.name} ${user.surname}`}</h1>
          <h3 className={`linked-author${user?.author_id ? " linked" : ""}`}>
            Linked author:{" "}
            {user?.author ? (
              <>
                <Link to={`/admin/authors/${user.author.id}`}>
                  {user.author.name} {user.author.surname}
                </Link>
                <button
                  className="button small"
                  onClick={() => handleUnlinkAuthor(user.id)}
                >
                  Unlink author
                </button>
              </>
            ) : (
              "None"
            )}
          </h3>
        </>
      )}
    </section>
  );
}
