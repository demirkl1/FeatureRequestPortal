import type { FeatureRequestStatus } from '../api/types';
import type { TranslationKey } from '../i18n';
import { useTranslation } from '../i18n';
import './StatusBadge.css';

const STATUS_CLASS_NAMES: Record<FeatureRequestStatus, string> = {
  0: 'status-badge--pending',
  1: 'status-badge--approved',
  2: 'status-badge--rejected',
  3: 'status-badge--planned',
  4: 'status-badge--completed',
  5: 'status-badge--cancelled',
};

export const STATUS_TRANSLATION_KEYS: Record<FeatureRequestStatus, TranslationKey> = {
  0: 'status.pending',
  1: 'status.approved',
  2: 'status.rejected',
  3: 'status.planned',
  4: 'status.completed',
  5: 'status.cancelled',
};

interface StatusBadgeProps {
  status: FeatureRequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  return <span className={`status-badge ${STATUS_CLASS_NAMES[status]}`}>{t(STATUS_TRANSLATION_KEYS[status])}</span>;
}
