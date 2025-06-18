import { Outlet } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import useSubmit from "../../../hooks/useSubmit";
import { useState } from "react";
import SearchBar from "../../../components/SearchBar/SearchBar";
import { useEffect } from "react";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import Pagination from "../../../components/Pagination/Pagination";
import "./RegistrationList.css";
import RegistrationCard from "../../../components/RegistrationCard/RegistrationCard";

export default function RegistrationList() {
  const [urlOption, setUrlOption] = useState("current");
  const [reloading, setReloading] = useState(false);
  const [filters, setFilters] = useState({
    limit: 9,
    page: 1,
    search: "",
  });

  const {
    data: registrationList,
    loading,
    refetch,
  } = useFetch(`/registration/${urlOption}`, {
    withCredentials: true,
    params: filters,
  });
  console.log(registrationList);
  const { submit } = useSubmit();

  useEffect(() => {
    setReloading(true);
    console.log("refetching...");
    const timeOutId = setTimeout(() => {
      refetch();
      setReloading(false);
    }, 500);

    return () => clearTimeout(timeOutId);
  }, [filters.limit, filters.page, filters.search]);

  const handleDelete = async (id) => {
    await submit({
      url: `/registration/${id}`,
      method: "DELETE",
    });
    refetch();
  };

  return (
    <section className="registration-page admin-section">
      <h1 className="sceondary title">Registrations</h1>
      <div className="list-container">
        <SearchBar
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          placeholder="Search for names or email"
          loading={reloading}
        />
        <div className="filters"></div>
        <div className="registration-list">
          {loading && !registrationList ? (
            <LoadingScreen />
          ) : registrationList && registrationList?.registrations.length > 0 ? (
            registrationList.registrations.map((registration) => (
              <RegistrationCard
                key={registration.id}
                registration={registration}
                fees={{
                  additionalFees: registrationList.additionalFees,
                  registrationFees: registrationList.registrationFees,
                }}
              />
            ))
          ) : (
            <p>No registration found</p>
          )}
        </div>
        <Pagination
          currentPage={filters.page}
          totalItems={registrationList?.total || 0}
          itemsPerPage={filters.limit}
          onPageChange={(value) =>
            setFilters((prev) => ({ ...prev, page: value }))
          }
        />
      </div>
      <Outlet />
    </section>
  );
}
