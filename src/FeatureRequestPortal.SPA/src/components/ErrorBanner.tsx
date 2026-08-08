import { useTranslation } from '../i18n';
import './ErrorBanner.css';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  const { t } = useTranslation();
  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__icon" aria-hidden="true">
        !
      </span>
      <span className="error-banner__message">{message}</span>
      {onRetry && (
        <button type="button" className="button button--ghost button--sm" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}
