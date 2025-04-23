// components/PaginationControls.js
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  withEllipsis = false,
}) {
  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);
    if (left > 2) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  const pages = withEllipsis
    ? getPaginationRange()
    : Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-controls">
      <div className="button-container">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="page-button"
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="page-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={item}
              className={`page-button ${currentPage === item ? "active" : ""}`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="page-button"
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
