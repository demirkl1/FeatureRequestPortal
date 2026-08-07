import { Link } from 'react-router-dom';
import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28">
          <path
            d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v11a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V18H5.5A1.5 1.5 0 0 1 4 16.5v-11z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="button button--primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
