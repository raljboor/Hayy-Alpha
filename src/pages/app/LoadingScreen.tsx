import { AppScreen } from '@/components/hayy/AppShell';

const Skel = ({ w = '100%', h = 14, r = 10, style }: { w?: string | number; h?: number; r?: number; style?: React.CSSProperties }) => (
  <div className="hy-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />
);

export default function LoadingScreen() {
  return (
    <AppScreen tab="home">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <Skel w={90} h={11} />
          <Skel w={150} h={26} r={8} style={{ marginTop: 10 }} />
        </div>
        <Skel w={42} h={42} r={14} />
      </div>
      <div style={{ border: '1px solid var(--line)', borderRadius: 20, padding: 18, marginBottom: 26 }}>
        <Skel w={110} h={20} r={999} />
        <Skel w="85%" h={20} style={{ marginTop: 14 }} />
        <Skel w="60%" h={20} style={{ marginTop: 8 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
          <Skel w={38} h={38} r={999} />
          <div style={{ flex: 1 }}>
            <Skel w={120} h={13} />
            <Skel w={90} h={11} style={{ marginTop: 6 }} />
          </div>
          <Skel w={90} h={38} r={999} />
        </div>
      </div>
      <Skel w={140} h={14} style={{ marginBottom: 14 }} />
      {[0, 1].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center', border: '1px solid var(--line)', borderRadius: 20, padding: 16, marginBottom: 10 }}>
          <Skel w={44} h={44} r={999} />
          <div style={{ flex: 1 }}>
            <Skel w="80%" h={15} />
            <Skel w="45%" h={11} style={{ marginTop: 8 }} />
          </div>
        </div>
      ))}
    </AppScreen>
  );
}
