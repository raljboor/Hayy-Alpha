import { SAFE_TOP } from '@/components/hayy/AppShell';
import { useNav } from '@/hooks/useNav';

const PushCard = ({ title, body, time, accent = false, big = false }: { title: string; body: string; time: string; accent?: boolean; big?: boolean }) => (
  <div style={{
    background: accent ? 'color-mix(in oklab, var(--clay) 10%, rgba(255,255,255,.85))' : 'rgba(255,255,255,.75)',
    backdropFilter: 'blur(18px)',
    borderRadius: 18, padding: '13px 16px',
    border: accent ? '1px solid color-mix(in oklab, var(--clay) 30%, transparent)' : '1px solid rgba(255,255,255,.5)',
    boxShadow: '0 2px 20px rgba(0,0,0,.1)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, background: accent ? 'var(--clay)' : '#888', flex: 'none' }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: '#3a2c20', flex: 1 }}>Hayy</span>
      <span style={{ fontSize: 11, color: '#7a6a5a' }}>{time}</span>
    </div>
    <p style={{ fontSize: big ? 14 : 13, fontWeight: 600, color: '#3a2c20', marginBottom: 3 }}>{title}</p>
    <p style={{ fontSize: 12.5, color: '#5a4636', lineHeight: 1.4 }}>{body}</p>
  </div>
);

export default function LockScreen() {
  const nav = useNav();
  return (
    <div className="hy" style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #efe2d2 0%, #e3cdb4 38%, #c98f63 100%)',
      fontFamily: 'var(--sans)',
    }}>
      {/* clock */}
      <div style={{ paddingTop: SAFE_TOP + 18, textAlign: 'center', color: '#3a2c20' }}>
        <p style={{ fontSize: 15, fontWeight: 600, letterSpacing: '.02em', opacity: 0.85 }}>Tuesday, May 31</p>
        <p style={{ fontFamily: 'var(--display)', fontSize: 86, lineHeight: 0.96, fontWeight: 500, letterSpacing: '-.02em', marginTop: 2 }}>9:41</p>
      </div>

      {/* notifications */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 9, padding: '0 12px 14px' }}>
        <p className="mono" style={{ fontSize: 10, letterSpacing: '.1em', color: '#5a4636', textTransform: 'uppercase', paddingLeft: 8, marginBottom: 2 }}>Notification Center</p>
        <div onClick={() => nav.go('wins')} style={{ cursor: 'pointer' }}>
          <PushCard accent big title="Maya Nasrallah · referral accepted" body={`"I just sent your profile to the hiring manager at AWS — they want to talk this week." 🎉`} time="2m ago" />
        </div>
        <PushCard accent title="Room 04 starts in 5 min" body="Breaking into Product at Big Tech — you RSVP'd. Tap to join." time="5m ago" />
        <PushCard title="Omar landed a PM role at RBC" body="A room you were in helped. Say congrats — he's hosting next week." time="1h ago" />
      </div>

      <div style={{ textAlign: 'center', paddingBottom: 22, color: '#4a392c' }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.8 }}>Swipe up to open · tap a card</p>
      </div>
    </div>
  );
}
