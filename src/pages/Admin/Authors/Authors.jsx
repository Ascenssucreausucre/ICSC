import { useState, useEffect, useRef } from "react";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { useAdminModal } from "../../../context/AdminModalContext";
import useSubmit from "../../../hooks/useSubmit";
import { Link, useParams } from "react-router-dom";
import "./Authors.css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import PaginationControls from "../../../components/PaginationControls/PaginationControls";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import countriesMap from "../../../assets/json/flag-countries.json";
import InputRange from "../../../components/InputRange/InputRange";

export default function Authors() {
  const { country } = useParams();
  const { openModal, openConfirmationModal } = useAdminModal();

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
  const [minArticles, setMinArticles] = useState(null);
  const [maxArticles, setMaxArticles] = useState(null);
  const [minArticlesEnabled, setMinArticlesEnabled] = useState(false);
  const [maxArticlesEnabled, setMaxArticlesEnabled] = useState(false);

  useEffect(() => {
    if (country) {
      setSelectedCountry({
        name: country,
        code: countriesMap.find(
          (countryInList) =>
            countryInList.name.toLowerCase() === country.toLowerCase()
        )?.code,
      });
    } else setSelectedCountry(null);
  }, [country]);

  function mapCountryNamesToCodes(countryNames) {
    return countryNames
      .map((name) => {
        const match = countriesMap.find(
          (country) => country.name.toLowerCase() === name.toLowerCase()
        );
        return match ? { name: match.name, code: match.code } : null;
      })
      .filter(Boolean);
  }

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/authors/filters`
        );
        setAvailableCountries(mapCountryNamesToCodes(data.countries));
        setAvailableAffiliations(data.affiliations);
      } catch (error) {
        console.error("Erreur chargement des filtres:", error);
      }
    };

    fetchFilters();
  }, []);

  const authorsListRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const [listHeight, setListHeight] = useState(null);

  const { submit } = useSubmit();

  useEffect(() => {
    if (authorsListRef.current && authors.length > 0 && !listHeight) {
      setListHeight(authorsListRef.current.clientHeight);
    }
  }, [authors, listHeight]);

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
            minArticles: minArticles,
            maxArticles: maxArticles,
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
      console.error("Error while retreiving authors:", err);
      setError(err.message || "Error while retreiving authors:");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      fetchAuthors();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchItem,
    pagination.page,
    pagination.pageSize,
    selectedCountry,
    selectedAffiliation,
    maxArticles,
    minArticles,
  ]);

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

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <section className="authors-list-container admin-section">
      <h1 className="secondary title">
        {country ? (
          <>
            <span
              className={`flag-icon flag-icon-${
                selectedCountry?.code ? selectedCountry.code : ""
              }`}
            ></span>
            {`Authors from ${country}`}
          </>
        ) : (
          "All authors"
        )}
      </h1>

      <SearchBar
        placeholder="Browse authors..."
        value={searchItem}
        onChange={(e) => {
          setSearchItem(e.target.value);
          setPagination({ ...pagination, page: 1 });
        }}
      />

      <div className="filters-row">
        {!country && (
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
            showClear
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
        )}

        <Dropdown
          value={selectedAffiliation}
          options={availableAffiliations}
          onChange={(e) => {
            setSelectedAffiliation(e.value);
            setPagination({ ...pagination, page: 1 });
          }}
          placeholder="Select Affiliation"
          filter
          showClear
          style={{ minWidth: "200px" }}
          itemTemplate={(option) => (
            <>
              <div title={option}>{option}</div>
            </>
          )}
          virtualScrollerOptions={{ itemSize: 40 }}
        />

        <button
          className="button small"
          onClick={() => {
            setSelectedAffiliation(null);
            if (!country) setSelectedCountry(null);
            setMinArticles(null);
            setMaxArticles(null);
            setMinArticlesEnabled(false);
            setMaxArticlesEnabled(false);
          }}
          disabled={
            selectedAffiliation === null &&
            (country ? true : selectedCountry === null) &&
            !minArticlesEnabled &&
            !maxArticlesEnabled
          }
        >
          Clear filters
        </button>
      </div>
      <div className="filters-row">
        <InputRange
          value={minArticles}
          onChange={(e) => setMinArticles(e.target.value)}
          label={"Minimum participations"}
          reset={() => setMinArticles(null)}
          setDefault={() => setMinArticles(1)}
          defaultValue={1}
          disabled={!minArticlesEnabled}
          setDisabled={setMinArticlesEnabled}
        />
        <InputRange
          value={maxArticles}
          onChange={(e) => setMaxArticles(e.target.value)}
          label={"Maximum participations"}
          reset={() => setMaxArticles(null)}
          setDefault={() => setMaxArticles(5)}
          defaultValue={5}
          disabled={!maxArticlesEnabled}
          setDisabled={setMaxArticlesEnabled}
        />
      </div>

      <p className="fetch-result">
        {!loading
          ? pagination.total > 0
            ? `
            Total of ${pagination.total} results found.`
            : `No authors found matching your search.`
          : `Loading...`}
      </p>
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
            {!loading ? (
              <>
                {authors.length > 0
                  ? authors.map((author) => {
                      const flagCode = {
                        name: author.country,
                        code: availableCountries
                          .find(
                            (country) =>
                              country.name.toLowerCase() ===
                              author.country.toLowerCase()
                          )
                          ?.code?.toLowerCase(),
                      };

                      return (
                        <div className="card author-card" key={author.id}>
                          <div className="grouped-title">
                            <Link
                              className="card-title link one-line-title"
                              to={`/admin/authors/${author.id}`}
                            >{`${author?.title ? author.title + " " : ""} ${
                              author.name
                            } ${author.surname}`}</Link>
                            <br />
                            <Link
                              className="country-title link"
                              to={`/admin/authors/country/${author.country.toLowerCase()}`}
                            >
                              {flagCode?.code ? (
                                <span
                                  className={`flag-icon flag-icon-${flagCode.code}`}
                                />
                              ) : null}{" "}
                              {author.country}
                            </Link>
                          </div>
                          <div className="flex-1 card-text">
                            <p className="limited-height-content">
                              <strong>Affiliation: </strong>
                              {author?.affiliation
                                ? author.affiliation
                                : "None"}
                            </p>
                            <p>
                              <strong>Participated articles: </strong>
                              {author.articles?.length || 0}
                            </p>
                          </div>
                          <div className="button-container">
                            <button
                              className="button small"
                              onClick={() => handleEditAuthor(author)}
                            >
                              Edit
                            </button>
                            <button
                              className="button small"
                              onClick={() =>
                                openConfirmationModal({
                                  text: "Are you sure to delete this author ?",
                                  handleAction: () =>
                                    handleDeleteAuthor(author.id),
                                })
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </>
            ) : (
              <p>No author found.</p>
            )}
          </div>
        )}
      </div>

      {pagination.total > 0 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          withEllipsis={true}
        />
      )}
      <div className="button-container">
        <button className="button wide" onClick={handleNewAuthor}>
          Add author
        </button>
      </div>
    </section>
  );
}
