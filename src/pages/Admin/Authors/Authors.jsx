import { useState, useEffect, useRef } from "react";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { useAdminModal } from "../../../context/AdminModalContext";
import useSubmit from "../../../hooks/useSubmit";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { Link } from "react-router-dom";
import "./Authors.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import countriesMap from "../../../assets/json/flag-countries.json";

export default function Authors() {
  const { openModal } = useAdminModal();
  const [confirmation, setConfirmation] = useState({
    confirm: false,
    id: null,
  });

  const [authors, setAuthors] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 9,
    total: 0,
  });

  const [availableCountries, setAvailableCountries] = useState([]);
  const [availableAffiliations, setAvailableAffiliations] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);

  function mapCountryNamesToCodes(countryNames) {
    return countryNames
      .map((name) => {
        const match = countriesMap.find(
          (country) => country.name.toLowerCase() === name.toLowerCase()
        );
        return match ? { name: match.name, code: match.code } : null;
      })
      .filter(Boolean); // retire les nulls si aucun match trouvé
  }

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/Authors/filters`
        );
        setAvailableCountries(mapCountryNamesToCodes(data.countries));
        setAvailableAffiliations(data.affiliations);
      } catch (error) {
        console.error("Erreur chargement des filtres:", error);
      }
    };

    fetchFilters();
  }, []);

  // Références pour maintenir la position de défilement
  const authorsListRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const [listHeight, setListHeight] = useState(null);

  const { submit } = useSubmit();

  // Mesurer la hauteur initiale de la liste pour maintenir une taille constante
  useEffect(() => {
    if (authorsListRef.current && authors.length > 0 && !listHeight) {
      setListHeight(authorsListRef.current.clientHeight);
    }
  }, [authors, listHeight]);

  // Charger les auteurs en utilisant l'API de recherche
  const fetchAuthors = async () => {
    if (loading === false) setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/authors/search`,
        {
          params: {
            search: searchItem,
            page: pagination.page,
            limit: pagination.pageSize,
            country: selectedCountry?.name,
            affiliation: selectedAffiliation,
          },
        }
      );

      setAuthors(response.data.results);
      setPagination({
        ...pagination,
        total: response.data.total,
      });
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des auteurs:", err);
      setError(
        err.message || "Une erreur est survenue lors du chargement des auteurs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [selectedCountry, selectedAffiliation]);

  // Effectuer la recherche lorsque les critères changent
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      fetchAuthors();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchItem, pagination.page, pagination.pageSize]);

  const authorTemplate = {
    name: "",
    surname: "",
    country: "",
    affiliation: "",
    title: "",
  };

  const handleNewAuthor = () => {
    openModal({
      url: "/Authors",
      method: "POST",
      title: "New author",
      initialData: authorTemplate,
      refreshFunction: fetchAuthors,
    });
  };

  const handleEditAuthor = (author) => {
    const { articles, ...authorData } = author;
    openModal({
      url: `/Authors/update/${author.id}`,
      method: "PUT",
      title: `Edit author ${author?.title ? author.title : ""} ${author.name} ${
        author.surname
      }`,
      initialData: authorData,
      refreshFunction: fetchAuthors,
    });
  };

  const handleDeleteAuthor = async (id) => {
    const response = await submit({
      url: `/Authors/delete/${id}`,
      method: "DELETE",
    });

    if (response.error) {
      return;
    }

    fetchAuthors();
  };

  // Gestion de la pagination
  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <section className="authors-list-container admin-section">
      <h1 className="secondary title">All authors</h1>
      <SearchBar
        placeholder="Browse authors..."
        value={searchItem}
        onChange={(e) => {
          setSearchItem(e.target.value);
          setPagination({ ...pagination, page: 1 });
        }}
      />
      <div
        className="filters-row"
        style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}
      >
        <Dropdown
          value={selectedCountry}
          options={availableCountries}
          onChange={(e) => {
            setSelectedCountry(e.value);
            setPagination({ ...pagination, page: 1 });
          }}
          placeholder="Select Country"
          optionLabel="name"
          filter
          valueTemplate={(option) => (
            <div className="country-option">
              {option ? (
                <>
                  <span
                    className={`flag-icon flag-icon-${option?.code.toLowerCase()}`}
                    style={{ marginRight: "8px" }}
                  />
                  {option.name}
                </>
              ) : (
                "Select Country"
              )}
            </div>
          )}
          itemTemplate={(option) => (
            <div className="country-option">
              <span
                className={`flag-icon flag-icon-${option.code.toLowerCase()}`}
                style={{ marginRight: "8px" }}
              />
              {option.name}
            </div>
          )}
          style={{ minWidth: "200px" }}
        />

        <Dropdown
          value={selectedAffiliation}
          options={availableAffiliations}
          onChange={(e) => {
            setSelectedAffiliation(e.value);
            setPagination({ ...pagination, page: 1 });
          }}
          placeholder="Select Affiliation"
          filter
          style={{ minWidth: "200px" }}
          itemTemplate={(option) => (
            <>
              <div title={option}>{option}</div>
            </>
          )}
        />

        <button
          className="button small"
          onClick={() => {
            setSelectedAffiliation(null), setSelectedCountry(null);
          }}
        >
          Clear filters
        </button>
      </div>
      {!loading ? (
        pagination.total > 0 ? (
          <p className="fetch-result">
            Total of {pagination.total} results found.
          </p>
        ) : (
          <p className="fetch-result">No authors found matching your search.</p>
        )
      ) : null}
      {confirmation.confirm ? (
        <ConfirmationModal
          handleAction={() => handleDeleteAuthor(confirmation.id)}
          text="Are you sure to delete this author ?"
          unShow={(unshow) =>
            setConfirmation({ ...confirmation, confirm: unshow })
          }
        />
      ) : null}

      <div
        className="authors-list-container page-list"
        ref={authorsListRef}
        style={{
          minHeight: listHeight ? `${listHeight}px` : "auto",
        }}
      >
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className="authors-list">
            {!loading && (
              <>
                {authors.length > 0
                  ? authors.map((author) => (
                      <div className="card author-card" key={author.id}>
                        <Link
                          className="card-title link"
                          to={`./${author.id}`}
                        >{`${author?.title ? author.title + " " : ""} ${
                          author.name
                        } ${author.surname}`}</Link>
                        <div className="flex-1">
                          <p>
                            <strong>Country: </strong>
                            {author.country}
                          </p>
                          <p>
                            <strong>Affiliation: </strong>
                            {author?.affiliation ? author.affiliation : "None"}
                          </p>
                          <p>
                            <strong>Participated articles: </strong>
                            {author.articles?.length || 0}
                          </p>
                        </div>
                        <div className="button-container">
                          <button
                            className="button"
                            onClick={() => handleEditAuthor(author)}
                          >
                            Edit
                          </button>
                          <button
                            className="button"
                            onClick={() =>
                              setConfirmation({ confirm: true, id: author.id })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  : null}
              </>
            )}
          </div>
        )}
      </div>

      {/* Pagination avec votre composant PaginationControls */}
      {pagination.total > 0 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          withEllipsis={true}
        />
      )}
      <div className="button-container">
        <button className="button" onClick={handleNewAuthor}>
          Add author
        </button>
      </div>
    </section>
  );
}
