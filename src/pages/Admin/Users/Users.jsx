import { useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import SearchBar from "../../../components/SearchBar/SearchBar";
import useFetch from "../../../hooks/useFetch";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";
import "./Users.css";
import useSubmit from "../../../hooks/useSubmit";
import { useAdminModal } from "../../../context/AdminModalContext";

export default function Users({}) {
  const [filters, setFilters] = useState({
    search: "",
    limit: 9,
    page: 1,
  });
  const [users, setUsers] = useState([]);
  const [reloading, setReloading] = useState(false);

  const { submit } = useSubmit();
  const { openConfirmationModal } = useAdminModal();

  const {
    data: usersData,
    loading,
    error,
    refetch,
  } = useFetch(`/user/get-all`, { withCredentials: true, params: filters });

  useEffect(() => {
    if (usersData) {
      setUsers(usersData.results);
    }
  }, [usersData]);

  useEffect(() => {
    setReloading(true);
    const timeOutId = setTimeout(() => {
      console.log("Reloading...");
      refetch();
      setReloading(false);
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [filters.limit, filters.page, filters.search]);

  const handleUnlinkAuthor = async (id) => {
    await submit({
      url: `/user/reset-author/${id}`,
      method: "PUT",
    });
    refetch();
  };

  const handleDeleteUser = async (id) => {
    await submit({
      url: `/user/delete/${id}`,
      method: "DELETE",
    });
    refetch();
  };

  return (
    <section className="admin-section">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <p>Error while retreiving users: {error}</p>
      ) : (
        <>
          <h1 className="title secondary">Users</h1>
          <SearchBar
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            placeholder="User names or author's PIN"
            loading={reloading}
          />
          <div className="filters"></div>
          <div className="users-container">
            {users.length > 0 ? (
              users.map((user) => (
                <div className="user card" key={user.id}>
                  <Link
                    to={`./${user.id}`}
                    className="card-title link"
                  >{`${user.name} ${user.surname}`}</Link>
                  <div className="user-data">
                    <p>
                      <strong>E-mail: </strong>
                      {user.email}
                    </p>
                    <p
                      className={`linked-author${
                        user?.author ? " linked" : ""
                      }`}
                    >
                      <strong>Linked author: </strong>
                      {user?.author ? (
                        <Link to={`/admin/authors/${user.author.id}`}>
                          {user.author.name} {user.author.surname}
                        </Link>
                      ) : (
                        "None"
                      )}
                    </p>
                  </div>
                  <div className="button-container">
                    <button
                      className="button small wide"
                      disabled={!user?.author}
                      onClick={() => handleUnlinkAuthor(user.id)}
                    >
                      Unlink Author
                    </button>
                    <button
                      className="button small wide"
                      onClick={() =>
                        openConfirmationModal({
                          text: "Are you sure to delete this user ? This action can't be undone.",
                          handleAction: () => handleDeleteUser(user.id),
                        })
                      }
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
          <Pagination
            currentPage={filters.page}
            totalItems={usersData.total}
            itemsPerPage={filters.limit}
            onPageChange={(value) =>
              setFilters((prev) => ({ ...prev, page: value }))
            }
          />
        </>
      )}
    </section>
  );
}
