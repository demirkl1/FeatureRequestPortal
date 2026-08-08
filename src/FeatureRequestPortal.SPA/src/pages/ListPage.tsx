import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { listFeatureRequests } from '../api/featureRequests';
import { ApiError } from '../api/http';
import type { FeatureRequestDto, FeatureRequestStatus } from '../api/types';
import { FEATURE_REQUEST_STATUSES } from '../api/types';
import { StatusBadge, STATUS_TRANSLATION_KEYS } from '../components/StatusBadge';
import { Pagination } from '../components/Pagination';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { SkeletonListItem } from '../components/Skeleton';
import { formatDate, useTranslation } from '../i18n';
import './ListPage.css';

const DEFAULT_PAGE_SIZE = 15;
const PAGE_SIZE_OPTIONS = [15, 20, 30, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

function isValidPageSize(value: number): value is PageSize {
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(value);
}

const SORT_OPTIONS = [
  { value: 'voteCount desc', labelKey: 'list.sort.mostVotes' as const },
  { value: 'creationTime desc', labelKey: 'list.sort.newest' as const },
];

export function ListPage() {
  const { currentUser } = useAuth();
  const { t, language } = useTranslation();
  const [items, setItems] = useState<FeatureRequestDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  /* Always opens on 15; the other sizes are a per-visit choice, not a remembered preference. */
  const [pageSize, setPageSize] = useState<PageSize>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<FeatureRequestStatus | 'all'>('all');
  const [sorting, setSorting] = useState<string>(SORT_OPTIONS[0].value);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listFeatureRequests({
        status: statusFilter === 'all' ? undefined : statusFilter,
        sorting,
        skipCount: (page - 1) * pageSize,
        maxResultCount: pageSize,
      });
      setItems(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('list.error.load'));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, sorting, page, pageSize, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const handlePageSizeChange = (value: number) => {
    const nextPageSize = isValidPageSize(value) ? value : DEFAULT_PAGE_SIZE;
    setPageSize(nextPageSize);
    setPage(1);
  };

  return (
    <div className="list-page">
      <div className="list-page__header">
        <div>
          <h1>{t('list.title')}</h1>
          <p className="list-page__subtitle">
            {currentUser.isAuthenticated ? t('list.subtitle.authenticated') : t('list.subtitle.anonymous')}
          </p>
        </div>
        {currentUser.isAuthenticated ? (
          <Link to="/new" className="button button--primary">
            {t('list.newRequest')}
          </Link>
        ) : (
          <Link to="/login" className="button button--secondary">
            {t('list.signInToSubmit')}
          </Link>
        )}
      </div>

      <div className="list-page__toolbar" role="group" aria-label={t('list.toolbar.ariaLabel')}>
        {currentUser.isAuthenticated && (
          <label className="list-page__control">
            <span>{t('list.filter.status')}</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                const raw = event.target.value;
                setStatusFilter(raw === 'all' ? 'all' : (Number(raw) as FeatureRequestStatus));
                setPage(1);
              }}
            >
              <option value="all">{t('list.filter.allStatuses')}</option>
              {FEATURE_REQUEST_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(STATUS_TRANSLATION_KEYS[status])}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="list-page__control">
          <span>{t('list.filter.sortBy')}</span>
          <select
            value={sorting}
            onChange={(event) => {
              setSorting(event.target.value);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey)}
              </option>
            ))}
          </select>
        </label>
        <label className="list-page__control">
          <span>{t('list.filter.pageSize')}</span>
          <select value={pageSize} onChange={(event) => handlePageSizeChange(Number(event.target.value))}>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {isLoading ? (
        <>
          <span className="sr-only" aria-live="polite">
            {t('common.loading')}
          </span>
          <ul className="request-list" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                <SkeletonListItem />
              </li>
            ))}
          </ul>
        </>
      ) : items.length === 0 && !error ? (
        <EmptyState
          title={t('list.empty.title')}
          description={currentUser.isAuthenticated ? t('list.empty.authenticated') : t('list.empty.anonymous')}
          actionLabel={currentUser.isAuthenticated ? t('list.empty.action') : undefined}
          actionTo={currentUser.isAuthenticated ? '/new' : undefined}
        />
      ) : (
        <ul className="request-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/requests/${item.id}`} className="request-row">
                <div className="request-row__main">
                  <span className="request-row__title">{item.title}</span>
                  <span className="request-row__meta mono">
                    {t('list.row.created', { date: formatDate(language, item.creationTime, { year: 'numeric', month: 'short', day: 'numeric' }) })}
                  </span>
                </div>
                <div className="request-row__side">
                  <StatusBadge status={item.status} />
                  <span className="request-row__votes mono" aria-label={t('list.row.votes', { count: item.voteCount })}>
                    {t('list.row.votes', { count: item.voteCount })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && items.length > 0 && (
        <Pagination page={page} pageSize={pageSize} totalCount={totalCount} onPageChange={setPage} />
      )}
    </div>
  );
}
