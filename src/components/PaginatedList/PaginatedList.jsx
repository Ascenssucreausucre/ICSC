import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginatedList({
  items = [],
  itemsPerPage = 5,
  renderItem,
  filterConfig = {},
  extraKey = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState(
    filterConfig.sort?.order || "desc"
  );
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const parsedFrom = filterFrom ? new Date(filterFrom) : null;
  const parsedTo = filterTo ? new Date(filterTo) : null;

  const filtered = useMemo(() => {
    let result = [...items];

    // Filtre par date
    if (filterConfig.dateRange?.key) {
      const dateKey = filterConfig.dateRange.key;
      result = result.filter((item) => {
        const date = new Date(item[dateKey]);
        if (parsedFrom && date < parsedFrom) return false;
        if (parsedTo && date > parsedTo) return false;
        return true;
      });
    }

    // Filtre par texte (recherche)
    if (filterConfig.search?.keys?.length && searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) =>
        filterConfig.search.keys.some((key) => {
          const value = item[key];
          return (
            typeof value === "string" &&
            value.toLowerCase().includes(lowerSearch)
          );
        })
      );
    }

    // Tri
    if (filterConfig.sort?.key) {
      const key = filterConfig.sort.key;
      result.sort((a, b) => {
        const aDate = new Date(a[key]);
        const bDate = new Date(b[key]);
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return result;
  }, [items, filterFrom, filterTo, sortOrder, searchTerm]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(
    () => setCurrentPage(1),
    [filterFrom, filterTo, sortOrder, searchTerm]
  );

  return (
    <>
      {/* Barre de recherche */}
      {filterConfig.search && (
        <div className="searchbar">
          <input
            type="text"
            placeholder={filterConfig.search.placeholder || "Search..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Filtres par date */}
      {filterConfig.dateRange && (
        <div className="filter-bar">
          <label>
            {filterConfig.dateRange.labelFrom || "From"}:
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </label>
          <label>
            {filterConfig.dateRange.labelTo || "To"}:
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
            />
          </label>
        </div>
      )}

      {/* Bouton de tri */}
      {filterConfig.sort && (
        <button
          className="button small"
          onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
        >
          {filterConfig.sort.label || "Sort"}: {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      )}

      {/* Liste paginée */}
      <div className="page-list">
        {paginated.length > 0 ? (
          paginated.map((item) => renderItem(item, extraKey && extraKey(item)))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-controls">
        <div className="button-container">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </>
  );
}
