import './Pagination.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, totalCount, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="button button--secondary button--sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrevious}
      >
        Previous
      </button>
      <span className="pagination__status">
        Page <span className="mono">{page}</span> of <span className="mono">{totalPages}</span>
        <span className="pagination__total"> · {totalCount} total</span>
      </span>
      <button
        type="button"
        className="button button--secondary button--sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
      >
        Next
      </button>
    </nav>
  );
}
