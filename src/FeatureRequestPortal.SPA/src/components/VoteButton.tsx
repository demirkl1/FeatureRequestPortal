import { Link } from 'react-router-dom';
import './VoteButton.css';

interface VoteButtonProps {
  voteCount: number;
  hasVoted: boolean;
  isAuthenticated: boolean;
  isBusy: boolean;
  onVote: () => void;
}

export function VoteButton({ voteCount, hasVoted, isAuthenticated, isBusy, onVote }: VoteButtonProps) {
  const disabled = !isAuthenticated || hasVoted || isBusy;
  const reason = !isAuthenticated
    ? 'Sign in to vote on this request.'
    : hasVoted
      ? 'You already voted on this request.'
      : null;

  return (
    <div className="vote-button-group">
      <button
        type="button"
        className={`vote-button ${hasVoted ? 'vote-button--voted' : ''}`}
        onClick={onVote}
        disabled={disabled}
        aria-pressed={hasVoted}
        aria-describedby={reason ? 'vote-button-reason' : undefined}
      >
        <svg className="vote-button__icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          {hasVoted ? (
            <path d="M4 8.5l4.5 4.5L16 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M10 3.5l6 7h-4v6H8v-6H4l6-7z" fill="currentColor" />
          )}
        </svg>
        <span className="vote-button__count mono">{voteCount}</span>
        <span className="vote-button__label">{hasVoted ? 'Voted' : 'Vote'}</span>
      </button>
      {reason && (
        <p id="vote-button-reason" className="vote-button__reason">
          {reason}
          {!isAuthenticated && (
            <>
              {' '}
              <Link to="/login">Sign in</Link>
            </>
          )}
        </p>
      )}
    </div>
  );
}
