import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  totalItems,
  itemsPerPage = 6,
  currentPage = 1,
  onPageChange,
  className = "",
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1); // Always show first

    if (left > 2) {
      range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages); // Always show last if not the only page
    }

    return range;
  };

  return (
    <div className={`pagination-controls ${className}`}>
      <div className="button-container">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="page-button"
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>

        {getPaginationRange().map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="page-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={item}
              className={`page-button ${currentPage === item ? "active" : ""}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="page-button"
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
