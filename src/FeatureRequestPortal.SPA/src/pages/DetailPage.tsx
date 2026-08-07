import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { POLICIES } from '../auth/policies';
import {
  addComment,
  changeFeatureRequestStatus,
  deleteFeatureRequest,
  getFeatureRequest,
  voteFeatureRequest,
} from '../api/featureRequests';
import { ApiError } from '../api/http';
import type { FeatureRequestDetailDto, FeatureRequestStatus } from '../api/types';
import { StatusBadge } from '../components/StatusBadge';
import { VoteButton } from '../components/VoteButton';
import { TextAreaField } from '../components/TextAreaField';
import { ErrorBanner } from '../components/ErrorBanner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../components/ToastProvider';
import './DetailPage.css';

const STATUS_OPTIONS: { value: FeatureRequestStatus; label: string }[] = [
  { value: 0, label: 'Pending' },
  { value: 1, label: 'Approved' },
  { value: 2, label: 'Rejected' },
  { value: 3, label: 'Planned' },
  { value: 4, label: 'Completed' },
  { value: 5, label: 'Cancelled' },
];

const COMMENT_MIN = 100;
const COMMENT_MAX = 2000;

function formatDate(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, hasPolicy } = useAuth();
  const { showToast } = useToast();

  const [detail, setDetail] = useState<FeatureRequestDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isVoting, setIsVoting] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [commentTouched, setCommentTouched] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  const [statusValue, setStatusValue] = useState<FeatureRequestStatus>(0);
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getFeatureRequest(id);
      setDetail(data);
      setStatusValue(data.status);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : 'Failed to load this request.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleVote = async () => {
    if (!id) return;
    setIsVoting(true);
    try {
      await voteFeatureRequest(id);
      await load();
      showToast('Vote recorded.', 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Unable to vote right now.', 'error');
    } finally {
      setIsVoting(false);
    }
  };

  const commentLength = commentText.trim().length;
  const commentValidationError = !commentTouched
    ? null
    : commentLength === 0
      ? 'Comment is required.'
      : commentLength < COMMENT_MIN
        ? `Comment must be at least ${COMMENT_MIN} characters (currently ${commentLength}).`
        : null;

  const isCommentValid = commentLength >= COMMENT_MIN && commentText.length <= COMMENT_MAX;

  const handleCommentSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCommentTouched(true);
    if (!id || !isCommentValid) return;
    setIsCommenting(true);
    setCommentError(null);
    try {
      await addComment(id, { text: commentText.trim() });
      setCommentText('');
      setCommentTouched(false);
      await load();
      showToast('Comment added.', 'success');
    } catch (err) {
      setCommentError(err instanceof ApiError ? err.message : 'Unable to add comment.');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleStatusChange = async () => {
    if (!id) return;
    setIsChangingStatus(true);
    try {
      await changeFeatureRequestStatus(id, { status: statusValue });
      await load();
      showToast('Status updated.', 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Unable to update status.', 'error');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteFeatureRequest(id);
      showToast('Request deleted.', 'success');
      navigate('/');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : 'Unable to delete this request.', 'error');
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="detail-page" aria-busy="true">
        <Skeleton width="50%" height="2rem" />
        <Skeleton width="25%" height="1.2rem" />
        <Skeleton width="100%" height="6rem" />
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="detail-page">
        <ErrorBanner message={loadError ?? 'This request could not be found.'} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/" className="detail-page__back">
        ← Back to requests
      </Link>

      <header className="detail-page__header">
        <div className="detail-page__heading">
          <h1>{detail.title}</h1>
          <StatusBadge status={detail.status} />
        </div>
        <dl className="detail-page__meta mono">
          <div>
            <dt>Created</dt>
            <dd>{formatDate(detail.creationTime)}</dd>
          </div>
          {detail.lastModificationTime && (
            <div>
              <dt>Updated</dt>
              <dd>{formatDate(detail.lastModificationTime)}</dd>
            </div>
          )}
          <div>
            <dt>ID</dt>
            <dd>{detail.id}</dd>
          </div>
        </dl>
      </header>

      <section className="detail-page__vote" aria-label="Voting">
        <VoteButton
          voteCount={detail.voteCount}
          hasVoted={detail.hasCurrentUserVoted}
          isAuthenticated={currentUser.isAuthenticated}
          isBusy={isVoting}
          onVote={handleVote}
        />
      </section>

      {detail.description && (
        <section className="detail-page__description">
          <h2>Description</h2>
          <p>{detail.description}</p>
        </section>
      )}

      {(hasPolicy(POLICIES.ChangeStatus) || hasPolicy(POLICIES.Delete)) && (
        <section className="detail-page__admin" aria-label="Admin controls">
          <h2>Admin controls</h2>
          <div className="detail-page__admin-row">
            {hasPolicy(POLICIES.ChangeStatus) && (
              <div className="detail-page__status-control">
                <label htmlFor="status-select" className="field__label">
                  Status
                </label>
                <div className="detail-page__status-inline">
                  <select
                    id="status-select"
                    value={statusValue}
                    onChange={(event) => setStatusValue(Number(event.target.value) as FeatureRequestStatus)}
                    disabled={isChangingStatus}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="button button--secondary"
                    onClick={handleStatusChange}
                    disabled={isChangingStatus || statusValue === detail.status}
                  >
                    {isChangingStatus ? 'Updating…' : 'Update status'}
                  </button>
                </div>
              </div>
            )}
            {hasPolicy(POLICIES.Delete) && (
              <button type="button" className="button button--danger" onClick={() => setDeleteDialogOpen(true)}>
                Delete request
              </button>
            )}
          </div>
        </section>
      )}

      <section className="detail-page__comments" aria-label="Comments">
        <h2>
          Comments <span className="mono">({detail.comments.length})</span>
        </h2>
        {detail.comments.length === 0 ? (
          <p className="detail-page__no-comments">No comments yet.</p>
        ) : (
          <ul className="comment-list">
            {detail.comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment__meta">
                  <span className="comment__author">{comment.creatorName ?? 'Unknown user'}</span>
                  <time className="comment__time mono" dateTime={comment.creationTime}>
                    {formatDate(comment.creationTime)}
                  </time>
                </div>
                <p className="comment__text">{comment.text}</p>
              </li>
            ))}
          </ul>
        )}

        {currentUser.isAuthenticated ? (
          <form className="comment-form" onSubmit={handleCommentSubmit} noValidate>
            <TextAreaField
              label="Add a comment"
              value={commentText}
              onChange={setCommentText}
              onBlur={() => setCommentTouched(true)}
              minLength={COMMENT_MIN}
              maxLength={COMMENT_MAX}
              required
              error={commentValidationError}
              hint={`Minimum ${COMMENT_MIN} characters required.`}
              disabled={isCommenting}
              rows={5}
            />
            {commentError && (
              <p className="comment-form__error" role="alert">
                {commentError}
              </p>
            )}
            <button type="submit" className="button button--primary" disabled={isCommenting || !isCommentValid}>
              {isCommenting ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        ) : (
          <p className="detail-page__signin-hint">
            <Link to="/login">Sign in</Link> to add a comment.
          </p>
        )}
      </section>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete this request?"
        description="This soft-deletes the request and removes it from all listings. Only an administrator can restore it."
        confirmLabel="Delete"
        isDangerous
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}
