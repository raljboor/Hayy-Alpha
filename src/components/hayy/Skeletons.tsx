import React from 'react';

const S = ({ style }: { style?: React.CSSProperties }) => (
  <div className="hy-skeleton" style={style} />
);

export const RoomCardSkeleton = () => (
  <div className="hy-card" style={{ overflow: 'hidden' }}>
    <S style={{ height: 96, borderRadius: 0 }} />
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <S style={{ height: 20, width: '75%' }} />
      <S style={{ height: 16 }} />
      <S style={{ height: 16, width: '83%' }} />
      <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
        <S style={{ height: 12, width: 80 }} />
        <S style={{ height: 12, width: 48 }} />
        <S style={{ height: 12, width: 48 }} />
      </div>
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <S style={{ height: 32, width: 32, borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <S style={{ height: 12, width: 80 }} />
            <S style={{ height: 12, width: 64 }} />
          </div>
        </div>
        <S style={{ height: 36, width: 64, borderRadius: 999 }} />
      </div>
    </div>
  </div>
);

export const ReferralCardSkeleton = () => (
  <div className="hy-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <S style={{ height: 40, width: 40, borderRadius: '50%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <S style={{ height: 14, width: 112 }} />
          <S style={{ height: 12, width: 160 }} />
        </div>
      </div>
      <S style={{ height: 20, width: 64, borderRadius: 999 }} />
    </div>
    <S style={{ height: 16, width: '66%' }} />
    <S style={{ height: 48 }} />
    <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
      <S style={{ height: 32, width: 64, borderRadius: 999 }} />
      <S style={{ height: 32, width: 80, borderRadius: 999 }} />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="hy-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <S style={{ height: 12, width: 80 }} />
    <S style={{ height: 32, width: 64 }} />
  </div>
);
