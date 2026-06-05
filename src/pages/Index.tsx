import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I, Avatar, Btn, LiveTag, Waveform, HayyMark, Meta } from '@/shared/primitives';
import { COMMUNITY_STATS, COMPANY_WALL, PEOPLE } from '@/shared/data';

const HeroNav = () => {
  const navigate = useNavigate();
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <HayyMark size={32} color="var(--clay)" />
        <span style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 500, letterSpacing: '0.12em' }}>HAYY</span>
      </div>
      <nav style={{ display: 'none', gap: 28, fontSize: 14, color: 'var(--ink-soft)' }} className="hero-nav">
        <span style={{ cursor: 'pointer' }}>Rooms</span>
        <span style={{ cursor: 'pointer' }}>Hosts</span>
        <span style={{ cursor: 'pointer' }}>For recruiters</span>
      </nav>
      <div style={{ display: 'flex', gap: 8 }}>
        <Btn kind="ghost" onClick={() => navigate('/login')}>Sign in</Btn>
        <Btn kind="primary" onClick={() => navigate('/signup')}>Join Hayy</Btn>
      </div>
      <style>{`@media(min-width:769px){.hero-nav{display:flex!important}}`}</style>
    </header>
  );
};

const LiveRoomCard = () => (
  <div className="hy-card" style={{ padding: 24, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-warm)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <LiveTag>Live · 18 listening</LiveTag>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>ROOM 04</span>
    </div>
    <h3 style={{ fontSize: 24, lineHeight: 1.1, marginBottom: 8 }}>
      Breaking into Product at Big Tech
    </h3>
    <p style={{ fontSize: 13, color: 'var(--ink-soft)', marginBottom: 18 }}>Hosted by Maya · 3 referral hosts on stage</p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
      {[
        { n: 'Maya N.', r: 'Sr PM · AWS', active: true, tone: 'clay' as const },
        { n: 'Rashid K.', r: 'Eng Mgr · Amazon', active: true, tone: 'dark' as const },
        { n: 'Jenna S.', r: 'Recruiter', active: false, tone: 'sand' as const },
        { n: 'Omar A.', r: 'Listener', active: false, tone: 'olive' as const },
      ].map((p, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Avatar name={p.n} size={52} tone={p.tone} />
            {p.active && <span style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '2px solid var(--clay)' }} />}
          </div>
          <p style={{ fontSize: 11, marginTop: 6, fontWeight: 500 }}>{p.n.split(' ')[0]}</p>
          <p style={{ fontSize: 10, color: 'var(--ink-mute)' }}>{p.r}</p>
        </div>
      ))}
    </div>

    <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--cream)', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <Waveform bars={20} height={22} color="var(--clay)" />
      <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>"I joined Amazon two years ago through a Hayy room…"</span>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Meta>Started 14 min ago · ends in ~30</Meta>
      <Btn kind="primary" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 16 })}>Tap to join</Btn>
    </div>
  </div>
);

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="hy" data-palette="dawn" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <section style={{ padding: '28px 44px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(80% 60% at 60% -10%, color-mix(in oklab, var(--clay) 14%, var(--bg)) 0%, var(--bg) 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
          <HeroNav />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center', marginTop: 64 }} className="hero-grid">
            <div>
              <span className="hy-pill" style={{ marginBottom: 22, display: 'inline-flex' }}>
                <span className="hy-livedot" /> 4 rooms live now
              </span>
              <h1 style={{ fontSize: 80, lineHeight: 0.98, letterSpacing: '-0.035em', marginBottom: 24 }}>
                Careers grow<br />
                <span className="display-italic">in conversation.</span>
              </h1>
              <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 460, lineHeight: 1.5, marginBottom: 32 }}>
                Meet the people inside companies you care about — not their inboxes.
                Drop into a room, get warm, then ask for the referral.
              </p>
              <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
                <Btn kind="primary" size="xl" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate('/signup')}>
                  Join the next room
                </Btn>
                <Btn kind="soft" size="xl" onClick={() => navigate('/signup')}>Become a host</Btn>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ display: 'flex' }}>
                  {PEOPLE.slice(0, 4).map((p, i) => (
                    <span key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                      <Avatar name={p.name} size={34} tone={p.tone} />
                    </span>
                  ))}
                </div>
                <p className="mono" style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                  {COMMUNITY_STATS.members} members<br />from {COMMUNITY_STATS.companies} companies
                </p>
              </div>
            </div>
            <div className="hero-card-col">
              <LiveRoomCard />
            </div>
          </div>
        </div>
        <style>{`
          .hero-grid { grid-template-columns: 1fr 1fr; }
          .hero-card-col { display: block; }
          @media(max-width:900px){
            .hero-grid { grid-template-columns: 1fr; }
            .hero-card-col { display: none; }
            h1 { font-size: 52px !important; }
          }
        `}</style>
      </section>

      {/* Community stats */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '32px 44px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 48, justifyContent: 'center' }}>
          {[
            { value: COMMUNITY_STATS.members, label: 'Members' },
            { value: COMMUNITY_STATS.companies, label: 'Companies' },
            { value: COMMUNITY_STATS.intros, label: 'Warm intros made' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: 48, lineHeight: 1 }}>{s.value}</p>
              <Meta style={{ display: 'block', marginTop: 6 }}>{s.label}</Meta>
            </div>
          ))}
        </div>
      </section>

      {/* Company wall */}
      <section style={{ padding: '48px 44px', textAlign: 'center' }}>
        <p className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 24 }}>
          Hosts from
        </p>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          {COMPANY_WALL.map(co => (
            <span key={co} style={{ fontFamily: 'var(--display)', fontSize: 18, color: 'var(--ink-soft)', fontWeight: 500 }}>{co}</span>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: '64px 44px', background: 'var(--cream)', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 48, lineHeight: 1.05, marginBottom: 16 }}>
            You're <span className="display-italic">two rooms</span> from your next yes.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', marginBottom: 32, lineHeight: 1.5 }}>
            Meet the people inside the companies you care about — not their inboxes.
          </p>
          <Btn kind="primary" size="xl" iconRight={React.cloneElement(I.arrow as React.ReactElement<{size?:number}>, { size: 18 })} onClick={() => navigate('/signup')}>
            Join Hayy
          </Btn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 44px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HayyMark size={20} color="var(--clay)" />
          <span style={{ fontFamily: 'var(--display)', fontSize: 15 }}>Hayy</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ink-mute)' }}>Careers grow in conversation. © 2026 Hayy</p>
      </footer>
    </div>
  );
}
