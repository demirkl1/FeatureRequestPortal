import './Skeleton.css';

interface SkeletonProps {
  width?: string;
  height?: string;
}

export function Skeleton({ width = '100%', height = '1em' }: SkeletonProps) {
  return <span className="skeleton" style={{ width, height }} aria-hidden="true" />;
}

export function SkeletonListItem() {
  return (
    <div className="skeleton-row" aria-hidden="true">
      <div className="skeleton-row__main">
        <Skeleton width="55%" height="1.05rem" />
        <Skeleton width="30%" height="0.8rem" />
      </div>
      <div className="skeleton-row__side">
        <Skeleton width="4.5rem" height="1.4rem" />
        <Skeleton width="3rem" height="0.9rem" />
      </div>
    </div>
  );
}
