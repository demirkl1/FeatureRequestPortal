import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { listFeatureRequests } from '../api/featureRequests';
import { ApiError } from '../api/http';
import type { FeatureRequestDto, FeatureRequestStatus } from '../api/types';
import { StatusBadge } from '../components/StatusBadge';
import { Pagination } from '../components/Pagination';
import { ErrorBanner } from '../components/ErrorBanner';
import { EmptyState } from '../components/EmptyState';
import { SkeletonListItem } from '../components/Skeleton';
import './ListPage.css';

const PAGE_SIZE = 15;

const STATUS_FILTER_OPTIONS: { value: FeatureRequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Approved' },
  { value: 2, label: 'Rejected' },
  { value: 3, label: 'Planned' },
  { value: 4, label: 'Completed' },
  { value: 5, label: 'Cancelled' },
];

const SORT_OPTIONS = [
  { value: 'voteCount desc', label: 'Most votes' },
  { value: 'creationTime desc', label: 'Newest' },
];

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ListPage() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<FeatureRequestDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
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
        skipCount: (page - 1) * PAGE_SIZE,
        maxResultCount: PAGE_SIZE,
      });
      setItems(result.items);
      setTotalCount(result.totalCount);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load feature requests.');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, sorting, page]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="list-page">
      <div className="list-page__header">
        <div>
          <h1>Feature requests</h1>
          <p className="list-page__subtitle">
            {currentUser.isAuthenticated
              ? 'Browse, vote, and comment on requests from the community.'
              : 'Browse approved feature requests. Sign in to vote, comment, and submit new ones.'}
          </p>
        </div>
        {currentUser.isAuthenticated ? (
          <Link to="/new" className="button button--primary">
            New request
          </Link>
        ) : (
          <Link to="/login" className="button button--secondary">
            Sign in to submit
          </Link>
        )}
      </div>

      <div className="list-page__toolbar" role="group" aria-label="Filter and sort requests">
        {currentUser.isAuthenticated && (
          <label className="list-page__control">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                const raw = event.target.value;
                setStatusFilter(raw === 'all' ? 'all' : (Number(raw) as FeatureRequestStatus));
                setPage(1);
              }}
            >
              {STATUS_FILTER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="list-page__control">
          <span>Sort by</span>
          <select
            value={sorting}
            onChange={(event) => {
              setSorting(event.target.value);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}

      {isLoading ? (
        <ul className="request-list" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <li key={index}>
              <SkeletonListItem />
            </li>
          ))}
        </ul>
      ) : items.length === 0 && !error ? (
        <EmptyState
          title="No feature requests yet"
          description={
            currentUser.isAuthenticated
              ? 'Be the first to submit a request for this product.'
              : 'Check back later, or sign in to submit the first request.'
          }
          actionLabel={currentUser.isAuthenticated ? 'New request' : undefined}
          actionTo={currentUser.isAuthenticated ? '/new' : undefined}
        />
      ) : (
        <ul className="request-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link to={`/requests/${item.id}`} className="request-row">
                <div className="request-row__main">
                  <span className="request-row__title">{item.title}</span>
                  <span className="request-row__meta mono">Created {formatDate(item.creationTime)}</span>
                </div>
                <div className="request-row__side">
                  <StatusBadge status={item.status} />
                  <span className="request-row__votes mono" aria-label={`${item.voteCount} votes`}>
                    {item.voteCount} votes
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && items.length > 0 && (
        <Pagination page={page} pageSize={PAGE_SIZE} totalCount={totalCount} onPageChange={setPage} />
      )}
    </div>
  );
}
