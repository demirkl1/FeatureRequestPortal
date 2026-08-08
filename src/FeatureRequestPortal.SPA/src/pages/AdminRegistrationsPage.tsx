import { useCallback, useEffect, useState } from 'react';
import { approveUser, getPendingUsers, rejectUser } from '../api/userApproval';
import { ApiError } from '../api/http';
import type { PendingUserDto } from '../api/types';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { SkeletonListItem } from '../components/Skeleton';
import { useToast } from '../components/ToastProvider';
import { formatDate, useTranslation } from '../i18n';
import './AdminRegistrationsPage.css';

interface DialogState {
  user: PendingUserDto;
  action: 'approve' | 'reject';
}

export function AdminRegistrationsPage() {
  const { showToast } = useToast();
  const { t, language } = useTranslation();

  const [users, setUsers] = useState<PendingUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const result = await getPendingUsers();
      setUsers(result);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : t('registrations.error.load'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleConfirm = async () => {
    if (!dialogState) return;
    const { user, action } = dialogState;
    setIsProcessing(true);
    try {
      if (action === 'approve') {
        await approveUser(user.id);
        showToast(t('registrations.toast.approved', { userName: user.userName }), 'success');
      } else {
        await rejectUser(user.id);
        showToast(t('registrations.toast.rejected', { userName: user.userName }), 'success');
      }
      await load();
    } catch (err) {
      const fallback = action === 'approve' ? t('registrations.toast.approveError') : t('registrations.toast.rejectError');
      showToast(err instanceof ApiError ? err.message : fallback, 'error');
    } finally {
      setIsProcessing(false);
      setDialogState(null);
    }
  };

  const isRejectDialog = dialogState?.action === 'reject';

  return (
    <div className="registrations-page">
      <div className="registrations-page__header">
        <h1>{t('registrations.title')}</h1>
        <p className="registrations-page__subtitle">{t('registrations.subtitle')}</p>
      </div>

      {loadError && <ErrorBanner message={loadError} onRetry={load} />}

      {isLoading ? (
        <>
          <span className="sr-only" aria-live="polite">
            {t('common.loading')}
          </span>
          <ul className="request-list" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <SkeletonListItem />
              </li>
            ))}
          </ul>
        </>
      ) : users.length === 0 && !loadError ? (
        <EmptyState title={t('registrations.empty.title')} description={t('registrations.empty.description')} />
      ) : (
        <div className="registrations-table-wrap">
          <table className="registrations-table">
            <thead>
              <tr>
                <th>{t('registrations.column.username')}</th>
                <th>{t('registrations.column.email')}</th>
                <th>{t('registrations.column.registered')}</th>
                <th className="registrations-table__actions-col">
                  <span className="sr-only">{t('registrations.column.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td className="mono">
                    {formatDate(language, user.creationTime, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td>
                    <div className="registrations-table__actions">
                      <button
                        type="button"
                        className="button button--secondary button--sm"
                        onClick={() => setDialogState({ user, action: 'approve' })}
                      >
                        {t('registrations.approve')}
                      </button>
                      <button
                        type="button"
                        className="button button--danger button--sm"
                        onClick={() => setDialogState({ user, action: 'reject' })}
                      >
                        {t('registrations.reject')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={dialogState !== null}
        title={isRejectDialog ? t('registrations.rejectDialog.title') : t('registrations.approveDialog.title')}
        description={isRejectDialog ? t('registrations.rejectDialog.description') : t('registrations.approveDialog.description')}
        confirmLabel={isRejectDialog ? t('registrations.reject') : t('registrations.approve')}
        isDangerous={isRejectDialog}
        isBusy={isProcessing}
        onConfirm={() => void handleConfirm()}
        onCancel={() => setDialogState(null)}
      />
    </div>
  );
}
