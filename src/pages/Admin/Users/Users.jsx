import { useState } from "react";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import SearchBar from "../../../components/SearchBar/SearchBar";
import useFetch from "../../../hooks/useFetch";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";

export default function Users({}) {
  const [filters, setFilters] = useState({
    search: "",
    limit: 12,
    page: 1,
  });
  const [users, setUsers] = useState([]);

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
    setTimeout(() => {
      refetch();
    }, 200);
  }, [filters]);

  return (
    <section className="admin-section">
      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <p>Error while retreiving users: {error}</p>
      ) : (
        <>
          <h1 className="title secondary">Users</h1>
          <SearchBar />
          <div className="filters"></div>
          <div className="users-container">
            {users.length > 0 ? (
              users.map((user) => (
                <div className="user card" key={user.id}>
                  <Link
                    to={`./${user.id}`}
                    className="card-title link"
                  >{`${user.name} ${user.surname}`}</Link>
                  <p>
                    <strong>E-mail: </strong>
                    {user.email}
                  </p>
                  <p>
                    <strong>Linked author: </strong>
                    {user?.author
                      ? `${user.author.name} ${user.author.surname}`
                      : "None"}
                  </p>
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
