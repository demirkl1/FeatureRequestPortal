import type { FeatureRequestStatus } from '../api/types';
import { FEATURE_REQUEST_STATUS_LABELS } from '../api/types';
import './StatusBadge.css';

const STATUS_CLASS_NAMES: Record<FeatureRequestStatus, string> = {
  0: 'status-badge--pending',
  1: 'status-badge--approved',
  2: 'status-badge--rejected',
  3: 'status-badge--planned',
  4: 'status-badge--completed',
  5: 'status-badge--cancelled',
};

interface StatusBadgeProps {
  status: FeatureRequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${STATUS_CLASS_NAMES[status]}`}>
      {FEATURE_REQUEST_STATUS_LABELS[status]}
    </span>
  );
}
