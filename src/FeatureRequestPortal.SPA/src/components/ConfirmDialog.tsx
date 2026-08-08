import { useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import './ConfirmDialog.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDangerous?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Uses the native <dialog> element so focus is trapped and Escape closes the
 * dialog for free — no bespoke focus-trap implementation needed.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isDangerous,
  isBusy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const resolvedConfirmLabel = confirmLabel ?? t('common.confirm');
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel');
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onCancel();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onCancel]);

  return (
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <h2 id="confirm-dialog-title" className="confirm-dialog__title">
        {title}
      </h2>
      <p id="confirm-dialog-desc" className="confirm-dialog__desc">
        {description}
      </p>
      <div className="confirm-dialog__actions">
        <button type="button" className="button button--secondary" onClick={onCancel} disabled={isBusy}>
          {resolvedCancelLabel}
        </button>
        <button
          type="button"
          className={`button ${isDangerous ? 'button--danger' : 'button--primary'}`}
          onClick={onConfirm}
          disabled={isBusy}
        >
          {isBusy ? t('common.working') : resolvedConfirmLabel}
        </button>
      </div>
    </dialog>
  );
}
