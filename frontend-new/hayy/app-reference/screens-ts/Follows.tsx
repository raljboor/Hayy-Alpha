import { useState } from 'react';
import { DrillScreen } from '@/components/hayy/AppShell';
import { Avatar, Btn, Card } from '@/components/hayy/HayyPrimitives';
import { useNav } from '@/hooks/useNav';

const followers = [
  { n: 'Maya Nasrallah', r: 'Sr PM · AWS', tone: 'clay', following: true },
  { n: 'Rashid Khoury', r: 'Eng Mgr · Amazon', tone: 'dark', following: true },
  { n: 'Jenna Sun', r: 'Talent · Shopify', tone: 'olive', following: false },
  { n: 'Omar Aziz', r: 'Data · RBC', tone: 'sand', following: true },
  { n: 'Priya Shah', r: 'Recruiter · Stripe', tone: 'clay', following: false },
];

export default function FollowsScreen() {
  const { go } = useNav();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');

  return (
    <DrillScreen title="Maya Nasrallah" eyebrow="">
      {/* Tab switcher */}
      <div style={{
        display: 'flex', padding: 3, borderRadius: 14, marginBottom: 20,
        background: 'color-mix(in oklab, var(--ink) 6%, var(--bg))',
      }}>
        {([['followers', '1.2k', 'Followers'], ['following', '318', 'Following']] as const).map(([id, count, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: 11, border: 'none', cursor: 'pointer',
              background: activeTab === id ? 'var(--paper)' : 'transparent',
              boxShadow: activeTab === id ? '0 1px 6px rgba(0,0,0,.1)' : 'none',
              fontWeight: 600, fontSize: 14,
              color: activeTab === id ? 'var(--ink)' : 'var(--ink-mute)',
              transition: 'all .15s',
            }}
          >
            {label} <span style={{ opacity: .65 }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Follow list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 32 }}>
        {followers.map((p) => (
          <div
            key={p.n}
            onClick={() => go('publicProfile')}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)', cursor: 'pointer' }}
          >
            <Avatar name={p.n} size={44} tone={p.tone} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>{p.n}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{p.r}</p>
            </div>
            <Btn kind={p.following ? 'soft' : 'primary'} onClick={(e) => e.stopPropagation()}>
              {p.following ? 'Following' : 'Follow'}
            </Btn>
          </div>
        ))}
      </div>
    </DrillScreen>
  );
}
