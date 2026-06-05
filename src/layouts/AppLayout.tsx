import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { I, Avatar, HayyMark } from '@/shared/primitives';
import { ME } from '@/shared/data';

// ── Nav items ──────────────────────────────────────────────────────
const PRIMARY = [
  { label: 'Home',     path: '/app/dashboard',    icon: I.home },
  { label: 'Roles',    path: '/app/roles',         icon: I.brief },
  { label: 'Activity', path: '/app/notifications', icon: I.bell,  dot: true },
  { label: 'Inbox',    path: '/app/messages',      icon: I.msg,   badge: 2 },
  { label: 'You',      path: '/app/profile',       icon: I.users },
];

const DISCOVER = [
  { label: 'Rooms',     path: '/app/rooms',     icon: I.mic },
  { label: 'Search',    path: '/app/search',    icon: I.search },
  { label: 'Referrals', path: '/app/referrals', icon: I.shake, badge: 4 },
];

// ── Sidebar row ────────────────────────────────────────────────────
const SideRow = ({ it }: { it: { label: string; path: string; icon: React.ReactNode; badge?: number; dot?: boolean } }) => (
  <NavLink to={it.path} style={{ textDecoration: 'none' }}>
    {({ isActive }) => (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
        borderRadius: 12, fontSize: 13, fontWeight: 500,
        background: isActive ? 'var(--clay)' : 'transparent',
        color: isActive ? 'var(--paper)' : 'var(--ink-soft)',
        cursor: 'pointer', userSelect: 'none',
      }}>
        <span style={{ position: 'relative', display: 'flex' }}>
          {React.cloneElement(it.icon as React.ReactElement<{ size?: number }>, { size: 18 })}
          {it.dot && !isActive && (
            <span style={{ position: 'absolute', top: -2, right: -2, width: 6, height: 6, borderRadius: 99, background: 'var(--clay)', border: '1.5px solid var(--cream)' }} />
          )}
        </span>
        <span style={{ flex: 1 }}>{it.label}</span>
        {it.badge && (
          <span className="mono" style={{
            fontSize: 10, padding: '2px 6px', borderRadius: 999,
            background: isActive ? 'rgba(255,255,255,.2)' : 'var(--clay)',
            color: isActive ? 'white' : 'var(--paper)',
          }}>{it.badge}</span>
        )}
      </div>
    )}
  </NavLink>
);

// ── Sidebar ────────────────────────────────────────────────────────
const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside style={{
      width: 220, background: 'var(--cream)', borderRight: '1px solid var(--line)',
      padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 18,
      height: '100%', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px' }}>
        <span style={{
          width: 28, height: 28, borderRadius: 10, background: 'var(--clay)',
          color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HayyMark size={18} color="var(--paper)" />
        </span>
        <span style={{ fontFamily: 'var(--display)', fontSize: 19, fontWeight: 500 }}>Hayy</span>
      </div>

      {/* Start a room */}
      <button
        onClick={() => navigate('/app/host')}
        className="hy-btn hy-btn-primary"
        style={{ width: '100%', justifyContent: 'center', gap: 8 }}
      >
        {React.cloneElement(I.plus as React.ReactElement<{ size?: number; stroke?: number }>, { size: 18, stroke: 2.2 })}
        Start a room
      </button>

      {/* Primary nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {PRIMARY.map(it => <SideRow key={it.label} it={it} />)}
      </div>

      {/* Discover */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <p className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: 'var(--ink-mute)', padding: '0 10px', marginBottom: 6, textTransform: 'uppercase' }}>Discover</p>
        {DISCOVER.map(it => <SideRow key={it.label} it={it} />)}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <NavLink to="/app/settings" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              borderRadius: 12, fontSize: 13, fontWeight: 500,
              background: isActive ? 'var(--clay)' : 'transparent',
              color: isActive ? 'var(--paper)' : 'var(--ink-soft)', cursor: 'pointer',
            }}>
              {React.cloneElement(I.gear as React.ReactElement<{ size?: number }>, { size: 18 })}
              <span>Settings</span>
            </div>
          )}
        </NavLink>

        {/* User card */}
        <div style={{ padding: '12px 14px', borderRadius: 14, background: 'var(--paper)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={ME.name} size={32} tone={ME.avatarTone} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{ME.name}</p>
              <p style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ME.headline}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ── Mobile bottom tab bar ──────────────────────────────────────────
const TABS = [
  { label: 'Home',  path: '/app/dashboard',    icon: I.home },
  { label: 'Roles', path: '/app/roles',         icon: I.brief },
  { label: 'Start', path: '/app/host',          icon: I.plus, center: true },
  { label: 'Inbox', path: '/app/messages',      icon: I.msg, badge: 2 },
  { label: 'You',   path: '/app/profile',       icon: I.users },
];

const MobileTabBar = () => (
  <nav style={{
    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
    paddingTop: 12, paddingBottom: 30, paddingLeft: 14, paddingRight: 14,
    background: 'var(--paper)', borderTop: '1px solid var(--line)',
    boxShadow: '0 -10px 30px -12px rgba(42,38,34,.22)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  }}>
    {TABS.map(t => {
      if ((t as { center?: boolean }).center) {
        return (
          <NavLink key={t.label} to={t.path} style={{ textDecoration: 'none', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{
              width: 46, height: 46, borderRadius: 16, marginTop: -2,
              background: 'var(--clay)', color: 'var(--paper)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 18px -6px color-mix(in oklab, var(--clay) 70%, transparent)',
            }}>
              {React.cloneElement(t.icon as React.ReactElement<{ size?: number; stroke?: number }>, { size: 24, stroke: 2.2 })}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.01em', color: 'var(--ink-mute)' }}>{t.label}</span>
          </NavLink>
        );
      }
      return (
        <NavLink key={t.label} to={t.path} style={{ textDecoration: 'none', flex: 1 }}>
          {({ isActive }) => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: isActive ? 'var(--clay)' : 'var(--ink-mute)' }}>
              <span style={{ position: 'relative' }}>
                {React.cloneElement(t.icon as React.ReactElement<{ size?: number; stroke?: number }>, { size: 23, stroke: isActive ? 2 : 1.6 })}
                {(t as { badge?: number }).badge && (
                  <span className="mono" style={{
                    position: 'absolute', top: -5, right: -9,
                    minWidth: 15, height: 15, padding: '0 4px', borderRadius: 999,
                    background: 'var(--clay)', color: 'var(--paper)', fontSize: 9, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--paper)',
                  }}>{(t as { badge?: number }).badge}</span>
                )}
              </span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500, letterSpacing: '.01em' }}>{t.label}</span>
            </div>
          )}
        </NavLink>
      );
    })}
  </nav>
);

// ── AppLayout ──────────────────────────────────────────────────────
export default function AppLayout() {
  return (
    <div className="hy" data-palette="dawn" style={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
      <style>{`
        .hy-sidebar { display: none; }
        .hy-mobile-tabbar { display: none; }
        @media (min-width: 769px) { .hy-sidebar { display: flex; } }
        @media (max-width: 768px) { .hy-mobile-tabbar { display: flex; } }
      `}</style>

      {/* Desktop sidebar */}
      <div className="hy-sidebar">
        <Sidebar />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', position: 'relative' }}>
        <Outlet />
      </main>

      {/* Mobile tab bar */}
      <div className="hy-mobile-tabbar">
        <MobileTabBar />
      </div>
    </div>
  );
}
