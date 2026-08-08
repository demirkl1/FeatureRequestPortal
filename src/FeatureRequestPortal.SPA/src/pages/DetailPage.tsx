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
  removeVote,
  voteFeatureRequest,
} from '../api/featureRequests';
import { ApiError } from '../api/http';
import type { FeatureRequestDetailDto, FeatureRequestStatus } from '../api/types';
import { FEATURE_REQUEST_STATUSES } from '../api/types';
import { StatusBadge, STATUS_TRANSLATION_KEYS } from '../components/StatusBadge';
import { VoteButton } from '../components/VoteButton';
import { TextAreaField } from '../components/TextAreaField';
import { ErrorBanner } from '../components/ErrorBanner';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../components/ToastProvider';
import { formatDate, useTranslation } from '../i18n';
import './DetailPage.css';

const COMMENT_MIN = 100;
const COMMENT_MAX = 2000;

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, hasPolicy } = useAuth();
  const { showToast } = useToast();
  const { t, language } = useTranslation();

  const STATUS_OPTIONS: { value: FeatureRequestStatus; label: string }[] = FEATURE_REQUEST_STATUSES.map(
    (status) => ({ value: status, label: t(STATUS_TRANSLATION_KEYS[status]) }),
  );

  const [detail, setDetail] = useState<FeatureRequestDetailDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isVoting, setIsVoting] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isWithdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

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
      setLoadError(err instanceof ApiError ? err.message : t('detail.error.load'));
    } finally {
      setIsLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleVote = async () => {
    if (!id) return;
    setIsVoting(true);
    try {
      await voteFeatureRequest(id);
      await load();
      showToast(t('detail.toast.voteRecorded'), 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('detail.error.vote'), 'error');
    } finally {
      setIsVoting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!id) return;
    setIsWithdrawing(true);
    try {
      await removeVote(id);
      await load();
      setWithdrawDialogOpen(false);
      showToast(t('detail.toast.voteWithdrawn'), 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('detail.error.withdraw'), 'error');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const commentLength = commentText.trim().length;
  const commentValidationError = !commentTouched
    ? null
    : commentLength === 0
      ? t('detail.comments.required')
      : commentLength < COMMENT_MIN
        ? t('detail.comments.tooShort', { min: COMMENT_MIN, length: commentLength })
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
      showToast(t('detail.toast.commentAdded'), 'success');
    } catch (err) {
      setCommentError(err instanceof ApiError ? err.message : t('detail.error.comment'));
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
      showToast(t('detail.toast.statusUpdated'), 'success');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('detail.error.status'), 'error');
    } finally {
      setIsChangingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteFeatureRequest(id);
      showToast(t('detail.toast.requestDeleted'), 'success');
      navigate('/');
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : t('detail.error.delete'), 'error');
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="detail-page" aria-busy="true">
        <span className="sr-only">{t('common.loading')}</span>
        <Skeleton width="50%" height="2rem" />
        <Skeleton width="25%" height="1.2rem" />
        <Skeleton width="100%" height="6rem" />
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="detail-page">
        <ErrorBanner message={loadError ?? t('detail.error.notFound')} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Link to="/" className="detail-page__back">
        {t('detail.back')}
      </Link>

      <header className="detail-page__header">
        <div className="detail-page__heading">
          <h1>{detail.title}</h1>
          <StatusBadge status={detail.status} />
        </div>
        <dl className="detail-page__meta mono">
          <div>
            <dt>{t('detail.meta.created')}</dt>
            <dd>{formatDate(language, detail.creationTime, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</dd>
          </div>
          {detail.lastModificationTime && (
            <div>
              <dt>{t('detail.meta.updated')}</dt>
              <dd>{formatDate(language, detail.lastModificationTime, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</dd>
            </div>
          )}
          <div>
            <dt>{t('detail.meta.id')}</dt>
            <dd>{detail.id}</dd>
          </div>
        </dl>
      </header>

      <section className="detail-page__vote" aria-label={t('detail.vote.sectionLabel')}>
        <VoteButton
          voteCount={detail.voteCount}
          hasVoted={detail.hasCurrentUserVoted}
          isAuthenticated={currentUser.isAuthenticated}
          isBusy={isVoting || isWithdrawing}
          onVote={handleVote}
          onWithdrawClick={() => setWithdrawDialogOpen(true)}
        />
      </section>

      {detail.description && (
        <section className="detail-page__description">
          <h2>{t('detail.description')}</h2>
          <p>{detail.description}</p>
        </section>
      )}

      {(hasPolicy(POLICIES.ChangeStatus) || hasPolicy(POLICIES.Delete)) && (
        <section className="detail-page__admin" aria-label={t('detail.admin.heading')}>
          <h2>{t('detail.admin.heading')}</h2>
          <div className="detail-page__admin-row">
            {hasPolicy(POLICIES.ChangeStatus) && (
              <div className="detail-page__status-control">
                <label htmlFor="status-select" className="field__label">
                  {t('detail.admin.status')}
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
                    {isChangingStatus ? t('detail.admin.updatingStatus') : t('detail.admin.updateStatus')}
                  </button>
                </div>
              </div>
            )}
            {hasPolicy(POLICIES.Delete) && (
              <button type="button" className="button button--danger" onClick={() => setDeleteDialogOpen(true)}>
                {t('detail.admin.deleteRequest')}
              </button>
            )}
          </div>
        </section>
      )}

      <section className="detail-page__comments" aria-label={t('detail.comments.heading')}>
        <h2>
          {t('detail.comments.heading')} <span className="mono">({detail.comments.length})</span>
        </h2>
        {detail.comments.length === 0 ? (
          <p className="detail-page__no-comments">{t('detail.comments.none')}</p>
        ) : (
          <ul className="comment-list">
            {detail.comments.map((comment) => (
              <li key={comment.id} className="comment">
                <div className="comment__meta">
                  <span className="comment__author">{comment.creatorName ?? t('detail.comments.unknownUser')}</span>
                  <time className="comment__time mono" dateTime={comment.creationTime}>
                    {formatDate(language, comment.creationTime, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
              label={t('detail.comments.addLabel')}
              value={commentText}
              onChange={setCommentText}
              onBlur={() => setCommentTouched(true)}
              minLength={COMMENT_MIN}
              maxLength={COMMENT_MAX}
              required
              error={commentValidationError}
              hint={t('detail.comments.hint', { min: COMMENT_MIN })}
              disabled={isCommenting}
              rows={5}
            />
            {commentError && (
              <p className="comment-form__error" role="alert">
                {commentError}
              </p>
            )}
            <button type="submit" className="button button--primary" disabled={isCommenting || !isCommentValid}>
              {isCommenting ? t('detail.comments.posting') : t('detail.comments.post')}
            </button>
          </form>
        ) : (
          <p className="detail-page__signin-hint">
            <Link to="/login">{t('detail.comments.signInHint')}</Link>
          </p>
        )}
      </section>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={t('detail.delete.title')}
        description={t('detail.delete.description')}
        confirmLabel={t('detail.delete.confirm')}
        isDangerous
        isBusy={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <ConfirmDialog
        open={isWithdrawDialogOpen}
        title={t('detail.withdraw.title')}
        description={t('detail.withdraw.description')}
        confirmLabel={t('detail.withdraw.confirm')}
        isBusy={isWithdrawing}
        onConfirm={handleWithdraw}
        onCancel={() => setWithdrawDialogOpen(false)}
      />
    </div>
  );
}
