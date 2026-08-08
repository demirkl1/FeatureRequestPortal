import { useTranslation } from '../i18n';
import './Pagination.css';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, totalCount, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalPages <= 1) return null;

  const canGoPrevious = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav className="pagination" aria-label={t('pagination.ariaLabel')}>
      <button
        type="button"
        className="button button--secondary button--sm"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrevious}
      >
        {t('pagination.previous')}
      </button>
      <span className="pagination__status">
        {t('pagination.pageStatus', { page, totalPages })}
        <span className="pagination__total"> · {t('pagination.total', { count: totalCount })}</span>
      </span>
      <button
        type="button"
        className="button button--secondary button--sm"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
      >
        {t('pagination.next')}
      </button>
    </nav>
  );
}
