import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import './PendingApprovalPage.css';

export function PendingApprovalPage() {
  const { t } = useTranslation();

  return (
    <div className="pending-approval-page">
      <div className="pending-approval-card">
        <h1>{t('pendingApproval.title')}</h1>
        <p className="pending-approval-card__message">{t('pendingApproval.message')}</p>
        <Link to="/" className="button button--primary">
          {t('pendingApproval.backLink')}
        </Link>
      </div>
    </div>
  );
}
