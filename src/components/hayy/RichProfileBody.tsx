import { ReactNode, CSSProperties } from 'react';
import { Card, Meta, Icon } from './HayyPrimitives';

// ── Logo (company/school monogram tile) ───────────────────────────────
export const CompanyLogo = ({ name = '', tone = 'sand' }: { name?: string; tone?: string }) => (
  <span
    className={`hy-avatar ${tone}`}
    style={{ width: 40, height: 40, borderRadius: 12, fontSize: 15, flex: 'none' }}
  >
    {name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase()}
  </span>
);

// ── PSection ──────────────────────────────────────────────────────────
export const PSection = ({ label, children, action }: { label: string; children: ReactNode; action?: ReactNode }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <p className="mono" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--ink-mute)' }}>{label}</p>
      {action}
    </div>
    {children}
  </div>
);

// ── TagRow ────────────────────────────────────────────────────────────
export const TagRow = ({ items, accent }: { items: string[]; accent?: boolean }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {items.map((t) => (
      <span
        key={t}
        className="hy-pill"
        style={{
          textTransform: 'none', letterSpacing: 0, fontSize: 13, padding: '8px 14px',
          ...(accent ? {
            background: 'color-mix(in oklab, var(--clay) 10%, var(--paper))',
            color: 'var(--clay)',
            borderColor: 'color-mix(in oklab, var(--clay) 24%, var(--line))',
          } : {}),
        }}
      >
        {t}
      </span>
    ))}
  </div>
);

// ── TimelineList ──────────────────────────────────────────────────────
interface TimelineEntry {
  role?: string;
  field?: string;
  co?: string;
  school?: string;
  dates?: string;
  year?: string;
  tone?: string;
}

export const TimelineList = ({ items }: { items: TimelineEntry[] }) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    {items.map((e, i) => (
      <div key={i} style={{ display: 'flex', gap: 13, paddingBottom: i < items.length - 1 ? 16 : 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
          <CompanyLogo name={e.co || e.school || ''} tone={e.tone} />
          {i < items.length - 1 && (
            <span style={{ flex: 1, width: 2, background: 'var(--line-soft)', marginTop: 4, minHeight: 14 }} />
          )}
        </div>
        <div style={{ flex: 1, paddingTop: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.2 }}>{e.role || e.field}</p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 2 }}>{e.co || e.school}</p>
          <Meta>{e.dates || e.year}</Meta>
        </div>
      </div>
    ))}
  </div>
);

// ── LinksList ─────────────────────────────────────────────────────────
interface LinkItem {
  label: string;
  url: string;
}

export const LinksList = ({ items }: { items: LinkItem[] }) => (
  <Card pad={0} style={{ overflow: 'hidden' }}>
    {items.map((l, i) => (
      <div
        key={l.label}
        style={{
          display: 'flex', alignItems: 'center', gap: 11, padding: '13px 15px',
          borderBottom: i < items.length - 1 ? '1px solid var(--line-soft)' : 'none',
        }}
      >
        <span style={{ color: 'var(--ink-mute)', display: 'flex' }}>
          <Icon d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={16} />
        </span>
        <span style={{ flex: 1, fontSize: 14 }}>{l.url}</span>
        <Meta>{l.label}</Meta>
      </div>
    ))}
  </Card>
);

// ── Profile data types ─────────────────────────────────────────────────
export interface ProfileData {
  bio?: string;
  lookingForLabel?: string;
  lookingFor?: string[];
  experience?: TimelineEntry[];
  education?: TimelineEntry[];
  skills?: string[];
  interests?: string[];
  links?: LinkItem[];
}

// ── RichProfileBody ───────────────────────────────────────────────────
export const RichProfileBody = ({ data }: { data: ProfileData }) => (
  <>
    {data.lookingFor && (
      <Card
        style={{
          marginBottom: 22,
          background: 'color-mix(in oklab, var(--clay) 7%, var(--paper))',
          borderColor: 'color-mix(in oklab, var(--clay) 20%, var(--line))',
        }}
      >
        <p className="mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: 'var(--clay)', marginBottom: 12 }}>
          {data.lookingForLabel || 'LOOKING FOR'}
        </p>
        <TagRow items={data.lookingFor} accent />
      </Card>
    )}
    {data.bio && (
      <PSection label="ABOUT">
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{data.bio}</p>
      </PSection>
    )}
    {data.experience && <PSection label="EXPERIENCE"><TimelineList items={data.experience} /></PSection>}
    {data.education && <PSection label="EDUCATION"><TimelineList items={data.education} /></PSection>}
    {data.skills && <PSection label="SKILLS"><TagRow items={data.skills} /></PSection>}
    {data.interests && <PSection label="INTERESTS"><TagRow items={data.interests} /></PSection>}
    {data.links && <PSection label="LINKS"><LinksList items={data.links} /></PSection>}
  </>
);

// ── Canonical profile data ────────────────────────────────────────────
export const MY_PROFILE: ProfileData = {
  bio: 'Two years in growth marketing, now building toward product. I care about fintech that\'s actually fair, and teams that ship with taste.',
  lookingForLabel: 'WHAT I\'M LOOKING FOR',
  lookingFor: ['APM roles', 'Product internships', 'Fintech & AI', 'Mentorship'],
  experience: [
    { role: 'Growth Marketing Lead', co: 'Lumen', dates: '2023 — Now', tone: 'clay' },
    { role: 'Marketing Associate', co: 'Brightwave', dates: '2021 — 2023', tone: 'olive' },
  ],
  education: [
    { field: 'BCom, Marketing', school: 'University of Toronto', year: '2017 — 2021', tone: 'dark' },
  ],
  skills: ['Product strategy', 'Growth', 'SQL', 'User research', 'Figma', 'Storytelling'],
  interests: ['Fintech', 'AI / ML', 'Startups', 'Climate', 'Design'],
  links: [
    { label: 'LinkedIn', url: 'in/adamsaleh' },
    { label: 'Portfolio', url: 'adam.work' },
    { label: 'GitHub', url: 'github.com/adams' },
  ],
};

export const MAYA_PROFILE: ProfileData = {
  bio: 'I help aspiring PMs find their footing — from portfolio to offer. Ask me anything about product interviews, AWS, or making a career switch.',
  lookingForLabel: 'HAPPY TO HELP WITH',
  lookingFor: ['Mentoring PMs', 'Referrals at AWS', 'Portfolio reviews', 'Mock interviews'],
  experience: [
    { role: 'Sr Product Manager', co: 'AWS', dates: '2021 — Now', tone: 'clay' },
    { role: 'Product Manager', co: 'Amazon', dates: '2018 — 2021', tone: 'dark' },
    { role: 'Associate PM', co: 'Microsoft', dates: '2016 — 2018', tone: 'olive' },
  ],
  education: [
    { field: 'MS, Computer Science', school: 'Stanford University', year: '2014 — 2016', tone: 'dark' },
    { field: 'BSc, Engineering', school: 'UBC', year: '2010 — 2014', tone: 'sand' },
  ],
  skills: ['Product sense', 'Roadmapping', 'Data & SQL', 'Hiring', 'Mentorship', '0→1'],
  interests: ['Product', 'Fintech', 'Career growth', 'Hiring', 'Public speaking'],
  links: [
    { label: 'LinkedIn', url: 'in/mayanasrallah' },
    { label: 'Website', url: 'maya.pm' },
  ],
};
