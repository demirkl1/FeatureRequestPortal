import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import './VoteButton.css';

interface VoteButtonProps {
  voteCount: number;
  hasVoted: boolean;
  isAuthenticated: boolean;
  isBusy: boolean;
  onVote: () => void;
  onWithdrawClick: () => void;
}

export function VoteButton({
  voteCount,
  hasVoted,
  isAuthenticated,
  isBusy,
  onVote,
  onWithdrawClick,
}: VoteButtonProps) {
  const { t } = useTranslation();
  const disabled = !isAuthenticated || isBusy;
  const reason = !isAuthenticated ? t('vote.reason.signIn') : hasVoted ? t('vote.reason.voted') : null;

  const handleClick = () => {
    if (hasVoted) {
      onWithdrawClick();
    } else {
      onVote();
    }
  };

  return (
    <div className="vote-button-group">
      <button
        type="button"
        className={`vote-button ${hasVoted ? 'vote-button--voted' : ''}`}
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={hasVoted}
        aria-label={hasVoted ? t('vote.aria.withdraw') : undefined}
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
        <span className="vote-button__label">{t(hasVoted ? 'vote.label.voted' : 'vote.label.vote')}</span>
      </button>
      {reason && (
        <p id="vote-button-reason" className="vote-button__reason">
          {!isAuthenticated ? <Link to="/login">{reason}</Link> : reason}
        </p>
      )}
    </div>
  );
}
