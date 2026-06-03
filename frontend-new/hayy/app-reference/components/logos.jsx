// Hayy — original logo explorations.
// All marks are single-color SVG using `currentColor` so they swap with theme.
// viewBox is 0 0 64 64 across the board so they substitute 1:1 in the frontend.

// ============================================================================
// MARKS
// ============================================================================

// D1 — Hexa-H. Refined version of the current DNA. Flat hexagon frame with a
// clean H ligature inside. Two posts, one crossbar, no interlace trickery.
const MarkHexaH = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth={weight}
    strokeLinejoin="round" strokeLinecap="round" aria-label="Hayy">
    <polygon points="32,4.5 56.5,18.5 56.5,45.5 32,59.5 7.5,45.5 7.5,18.5" />
    <path d="M22.5 20 L22.5 44 M41.5 20 L41.5 44 M22.5 32 L41.5 32" />
  </svg>
);

// D2 — Crescent (Hilal). A waning moon cradling a small dot. The Arabic root
// of "Hayy" sits behind this — the evening, the gathering, the presence.
// Filled mass (not stroke) — gives variety against the line marks and lets
// the silhouette do the work at any size.
const MarkCrescent = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Outer circle minus an offset inner circle = crescent on the left.
        Both subpaths drawn the same way; evenodd carves the inner out. */}
    <path fill="currentColor" fillRule="evenodd" d="
      M 32 4
      a 28 28 0 1 0 0 56
      a 28 28 0 1 0 0 -56 z
      M 42 12
      a 22 22 0 1 0 0 44
      a 22 22 0 1 0 0 -44 z
    " />
    {/* The dot in the crescent's lap — a small companion */}
    <circle cx="48" cy="32" r="3.4" fill="currentColor" />
  </svg>
);

// D3 — Aperture. Concentric rings with a solid centre — "alive", "live room",
// breath, presence. Quietest of the marks; ages well at any size.
const MarkAperture = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth={weight} aria-label="Hayy">
    <circle cx="32" cy="32" r="28" />
    <circle cx="32" cy="32" r="18" />
    <circle cx="32" cy="32" r="8" fill="currentColor" stroke="none" />
  </svg>
);

// D4 — Constellation. The live room drawn as a small star map: a brighter
// host node in the middle, listeners scattered around it, connected by quiet
// lines. Asymmetric on purpose — feels alive, not stamped.
const MarkConstellation = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.55);
  const nodes = [
    { x: 12, y: 16, r: 2.6 },
    { x: 44, y: 9,  r: 3.0 },
    { x: 56, y: 30, r: 2.4 },
    { x: 46, y: 54, r: 2.8 },
    { x: 16, y: 48, r: 2.4 },
  ];
  const host = { x: 30, y: 32, r: 4.6 };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {/* connecting lines from host out to each listener */}
      {nodes.map((n, i) => (
        <line key={i} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round" />
      ))}
      {/* listeners */}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      {/* host — a slightly larger node with a soft ring around it */}
      <circle cx={host.x} cy={host.y} r={host.r + 3.5}
        fill="none" stroke="currentColor" strokeWidth={lw} opacity="0.55" />
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// D5 — Pulse. A single rounded square with a dot — minimal, frontend-native.
// Reads as a "room" with someone live inside. Best at tiny sizes (favicon,
// mobile tab bar).
const MarkPulse = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} fill="none"
    stroke="currentColor" strokeWidth={weight} aria-label="Hayy">
    <rect x="5.5" y="5.5" width="53" height="53" rx="12" />
    <circle cx="32" cy="32" r="9" fill="currentColor" stroke="none" />
  </svg>
);

// ============================================================================
// V2 — variations inspired by Aperture (D3) and Constellation (D4)
// All share the dot-and-circle vocabulary: presence, gathering, the room.
// ============================================================================

// Orbit — one host, one satellite, on a tilted elliptical path. Most intimate
// version — a single conversation, a pair.
const MarkOrbit = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    <g transform="rotate(-22 32 32)">
      <ellipse cx="32" cy="32" rx="26" ry="13" fill="none"
        stroke="currentColor" strokeWidth={weight * 0.85} />
    </g>
    <circle cx="32" cy="32" r="5.8" fill="currentColor" />
    <circle cx="56" cy="22.3" r="3.4" fill="currentColor" />
  </svg>
);

// Echo — a source in the corner, ripples spreading outward in quarter-arcs.
// Reads as voice carrying, sound emanating, attention spreading. Most
// directional / kinetic of the set.
const MarkEcho = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    <circle cx="14" cy="50" r="5.5" fill="currentColor" />
    <path d="M 28 50 A 14 14 0 0 1 14 36" fill="none"
      stroke="currentColor" strokeWidth={weight} strokeLinecap="round" />
    <path d="M 40 50 A 26 26 0 0 1 14 24" fill="none"
      stroke="currentColor" strokeWidth={weight} strokeLinecap="round" />
    <path d="M 52 50 A 38 38 0 0 1 14 12" fill="none"
      stroke="currentColor" strokeWidth={weight} strokeLinecap="round" />
  </svg>
);

// Halo — host at the centre with a thin ring around it, dotted with
// listeners at irregular angles. A packed room, a circle of attention.
const MarkHalo = ({ size = 64, weight = 2.4 }) => {
  const angles = [12, 56, 95, 142, 182, 226, 268, 318];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      <circle cx="32" cy="32" r="26" fill="none"
        stroke="currentColor" strokeWidth={weight * 0.6} />
      <circle cx="32" cy="32" r="7" fill="currentColor" />
      {angles.map((a, i) => {
        const r = a * Math.PI / 180;
        return (
          <circle key={i}
            cx={32 + 26 * Math.cos(r)}
            cy={32 + 26 * Math.sin(r)}
            r="2.6" fill="currentColor" />
        );
      })}
    </svg>
  );
};

// Atrium — Aperture's concentric rings + Constellation's people. The host
// in the middle, an inner ring of speakers, an outer ring of listeners.
// Most literal hybrid of D3 and D4.
const MarkAtrium = ({ size = 64, weight = 2.4 }) => {
  const innerR = 16, outerR = 28;
  const inner = [30, 145, 265];
  const outer = [62, 108, 200, 322];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      <circle cx="32" cy="32" r={outerR} fill="none"
        stroke="currentColor" strokeWidth={weight * 0.55} />
      <circle cx="32" cy="32" r={innerR} fill="none"
        stroke="currentColor" strokeWidth={weight * 0.55} />
      <circle cx="32" cy="32" r="4.6" fill="currentColor" />
      {inner.map((a, i) => {
        const r = a * Math.PI / 180;
        return <circle key={`i${i}`}
          cx={32 + innerR * Math.cos(r)}
          cy={32 + innerR * Math.sin(r)}
          r="2.6" fill="currentColor" />;
      })}
      {outer.map((a, i) => {
        const r = a * Math.PI / 180;
        return <circle key={`o${i}`}
          cx={32 + outerR * Math.cos(r)}
          cy={32 + outerR * Math.sin(r)}
          r="2.4" fill="currentColor" />;
      })}
    </svg>
  );
};

// Convene — a loose cluster of dots, no lines, no rings. Casual gathering.
// Closest in spirit to Constellation but without the network — feels more
// like fireflies in a courtyard than a host-and-listeners diagram.
const MarkConvene = ({ size = 64, weight = 2.4 }) => {
  const dots = [
    { x: 30, y: 30, r: 4.6 },
    { x: 14, y: 22, r: 2.4 },
    { x: 46, y: 14, r: 2.0 },
    { x: 54, y: 38, r: 2.6 },
    { x: 42, y: 52, r: 2.2 },
    { x: 18, y: 48, r: 2.8 },
    { x: 10, y: 36, r: 1.8 },
    { x: 34, y: 11, r: 1.8 },
    { x: 56, y: 24, r: 1.6 },
    { x: 26, y: 56, r: 2.2 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="currentColor" />
      ))}
    </svg>
  );
};

// ============================================================================
// V3 — refinement variants of the three finalists (Atrium / Constellation / Convene)
// Each direction gets a quieter "intimate" version and a denser "full" version
// to flank the balanced original.
// ============================================================================

// --- Atrium variants ---

const MarkAtriumIntimate = ({ size = 64, weight = 2.4 }) => {
  const innerR = 16, outerR = 28;
  const inner = [40, 200];
  const outer = [90, 250, 340];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      <circle cx="32" cy="32" r={outerR} fill="none"
        stroke="currentColor" strokeWidth={weight * 0.55} />
      <circle cx="32" cy="32" r={innerR} fill="none"
        stroke="currentColor" strokeWidth={weight * 0.55} />
      <circle cx="32" cy="32" r="4.6" fill="currentColor" />
      {inner.map((a, i) => {
        const r = a * Math.PI / 180;
        return <circle key={`i${i}`}
          cx={32 + innerR * Math.cos(r)}
          cy={32 + innerR * Math.sin(r)}
          r="2.6" fill="currentColor" />;
      })}
      {outer.map((a, i) => {
        const r = a * Math.PI / 180;
        return <circle key={`o${i}`}
          cx={32 + outerR * Math.cos(r)}
          cy={32 + outerR * Math.sin(r)}
          r="2.4" fill="currentColor" />;
      })}
    </svg>
  );
};

const MarkAtriumFull = ({ size = 64, weight = 2.4 }) => {
  const innerR = 16, outerR = 28;
  const inner = [10, 75, 145, 215, 295];
  const outer = [30, 70, 110, 165, 200, 240, 300, 340];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      <circle cx="32" cy="32" r={outerR} fill="none"
        stroke="currentColor" strokeWidth={weight * 0.55} />
      <circle cx="32" cy="32" r={innerR} fill="none"
        stroke="currentColor" strokeWidth={weight * 0.55} />
      <circle cx="32" cy="32" r="4.6" fill="currentColor" />
      {inner.map((a, i) => {
        const r = a * Math.PI / 180;
        return <circle key={`i${i}`}
          cx={32 + innerR * Math.cos(r)}
          cy={32 + innerR * Math.sin(r)}
          r="2.2" fill="currentColor" />;
      })}
      {outer.map((a, i) => {
        const r = a * Math.PI / 180;
        return <circle key={`o${i}`}
          cx={32 + outerR * Math.cos(r)}
          cy={32 + outerR * Math.sin(r)}
          r="2.0" fill="currentColor" />;
      })}
    </svg>
  );
};

// --- Constellation variants ---

// Pair: host + 3 listeners. More poetic, less diagrammatic.
const MarkConstellationPair = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.55);
  const nodes = [
    { x: 14, y: 14, r: 3.0 },
    { x: 52, y: 22, r: 2.6 },
    { x: 38, y: 54, r: 2.8 },
  ];
  const host = { x: 30, y: 32, r: 4.8 };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {nodes.map((n, i) => (
        <line key={i} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round" />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      <circle cx={host.x} cy={host.y} r={host.r + 3.5}
        fill="none" stroke="currentColor" strokeWidth={lw} opacity="0.55" />
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// Web: host + 5 listeners, but listeners also connected to each other.
// Feels more like a group chat than a broadcast.
const MarkConstellationWeb = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.45);
  const nodes = [
    { x: 12, y: 16, r: 2.6 },
    { x: 44, y: 9,  r: 3.0 },
    { x: 56, y: 30, r: 2.4 },
    { x: 46, y: 54, r: 2.8 },
    { x: 16, y: 48, r: 2.4 },
  ];
  const host = { x: 30, y: 32, r: 4.6 };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {/* host → each listener */}
      {nodes.map((n, i) => (
        <line key={`h${i}`} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round" opacity="0.85" />
      ))}
      {/* listener → next listener (the outer ring of the web) */}
      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        return <line key={`r${i}`} x1={n.x} y1={n.y} x2={next.x} y2={next.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round" opacity="0.45" />;
      })}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      <circle cx={host.x} cy={host.y} r={host.r + 3.5}
        fill="none" stroke="currentColor" strokeWidth={lw} opacity="0.55" />
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// --- Convene variants ---

// Sparse: 6 dots, more breathing room.
const MarkConveneSparse = ({ size = 64, weight = 2.4 }) => {
  const dots = [
    { x: 32, y: 30, r: 4.6 },
    { x: 14, y: 20, r: 2.6 },
    { x: 50, y: 16, r: 2.4 },
    { x: 54, y: 42, r: 2.8 },
    { x: 22, y: 50, r: 2.6 },
    { x: 44, y: 54, r: 2.2 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="currentColor" />
      ))}
    </svg>
  );
};

// Drift: dots leaning into one half — feels like the room turning to listen.
const MarkConveneDrift = ({ size = 64, weight = 2.4 }) => {
  const dots = [
    { x: 42, y: 30, r: 4.6 },
    { x: 24, y: 18, r: 2.2 },
    { x: 50, y: 14, r: 2.4 },
    { x: 58, y: 32, r: 2.8 },
    { x: 52, y: 50, r: 2.4 },
    { x: 30, y: 48, r: 2.6 },
    { x: 38, y: 56, r: 1.8 },
    { x: 56, y: 24, r: 1.8 },
    { x: 32, y: 12, r: 1.6 },
    { x: 14, y: 30, r: 1.6 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="currentColor" />
      ))}
    </svg>
  );
};

// ============================================================================
// V4 — Hub direction refinements. Pushing the chosen Constellation · Hub away
// from "generic radial symbol" territory. Each variant breaks one of the
// things that made the original feel stamped: symmetry, equal node weights,
// uniform line treatment, or the lack of a hidden ligature.
// ============================================================================

// Hub · Starweight — same hub-and-spoke vocabulary, but stars vary in size
// (brighter/dimmer like a real sky) and angles are irregular. The single
// biggest detail that kills the "clip-art" feel.
const MarkConstellationStarweight = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.5);
  const host = { x: 30, y: 32, r: 4.6 };
  // varied sizes + irregular angles, like an actual constellation
  const nodes = [
    { x: 10, y: 12, r: 3.4 },   // bright top-left
    { x: 50, y: 8,  r: 1.8 },   // small upper-right
    { x: 58, y: 36, r: 2.8 },   // medium right
    { x: 40, y: 56, r: 2.0 },   // small lower
    { x: 14, y: 50, r: 3.0 },   // bright lower-left
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {nodes.map((n, i) => (
        <line key={i} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round" opacity="0.75" />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      <circle cx={host.x} cy={host.y} r={host.r + 3.5}
        fill="none" stroke="currentColor" strokeWidth={lw} opacity="0.55" />
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// Hub · Letter — node positions chosen so the connecting lines form a soft
// "H" ligature through the host. The brand mark is the network, literally.
const MarkConstellationLetter = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.55);
  // Left + right posts, host on crossbar middle
  const host = { x: 32, y: 32, r: 4.6 };
  const tl = { x: 14, y: 10, r: 2.8 };
  const bl = { x: 14, y: 54, r: 2.8 };
  const tr = { x: 50, y: 10, r: 2.8 };
  const br = { x: 50, y: 54, r: 2.8 };
  // Two crossbar listeners flanking the host
  const ml = { x: 14, y: 32, r: 2.4 };
  const mr = { x: 50, y: 32, r: 2.4 };
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {/* left post */}
      <line x1={tl.x} y1={tl.y} x2={bl.x} y2={bl.y}
        stroke="currentColor" strokeWidth={lw} strokeLinecap="round" />
      {/* right post */}
      <line x1={tr.x} y1={tr.y} x2={br.x} y2={br.y}
        stroke="currentColor" strokeWidth={lw} strokeLinecap="round" />
      {/* crossbar through host */}
      <line x1={ml.x} y1={ml.y} x2={mr.x} y2={mr.y}
        stroke="currentColor" strokeWidth={lw} strokeLinecap="round" />
      {/* nodes */}
      {[tl, bl, tr, br, ml, mr].map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      {/* host — slightly more prominent, sits on the crossbar */}
      <circle cx={host.x} cy={host.y} r={host.r + 3.2}
        fill="none" stroke="currentColor" strokeWidth={lw * 0.85} opacity="0.55" />
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// Hub · Tilted — the original 5-listener pattern, but rotated and
// translated so the host is off-center. Reads as a found object, not a
// symmetrical icon. Single most effective way to escape "clip-art".
const MarkConstellationTilted = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.55);
  // Authored in a tilted frame, then rotated -18° around (32,32)
  const host = { x: 26, y: 36, r: 4.6 };
  const nodes = [
    { x: 8,  y: 22, r: 2.6 },
    { x: 38, y: 8,  r: 3.0 },
    { x: 56, y: 22, r: 2.4 },
    { x: 48, y: 50, r: 2.8 },
    { x: 16, y: 56, r: 2.4 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      <g transform="rotate(-14 32 32)">
        {nodes.map((n, i) => (
          <line key={i} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
            stroke="currentColor" strokeWidth={lw} strokeLinecap="round" />
        ))}
        {nodes.map((n, i) => (
          <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
        ))}
        <circle cx={host.x} cy={host.y} r={host.r + 3.5}
          fill="none" stroke="currentColor" strokeWidth={lw} opacity="0.55" />
        <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
      </g>
    </svg>
  );
};

// Hub · Beam — directional lines emanating from the host, longer than the
// original spokes, terminating in stars at varied distances. Implies voice
// carrying, attention spreading. Less "network", more "broadcast".
const MarkConstellationBeam = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.6);
  const host = { x: 32, y: 32, r: 5.2 };
  // longer beams to the edges, varied lengths
  const beams = [
    { x: 6,  y: 14, r: 2.4 },
    { x: 58, y: 10, r: 2.8 },
    { x: 60, y: 44, r: 2.2 },
    { x: 30, y: 60, r: 3.0 },
    { x: 8,  y: 50, r: 2.0 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {/* beams — slightly thicker, taper visually via two-stop opacity */}
      {beams.map((n, i) => {
        // shorten the line so it touches the node edge, not the center
        const dx = n.x - host.x, dy = n.y - host.y;
        const len = Math.hypot(dx, dy);
        const x2 = n.x - (dx / len) * n.r;
        const y2 = n.y - (dy / len) * n.r;
        const x1 = host.x + (dx / len) * host.r;
        const y1 = host.y + (dy / len) * host.r;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="currentColor" strokeWidth={lw} strokeLinecap="round" opacity="0.85" />
        );
      })}
      {beams.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// Hub · Halo — Aperture's soft ring around the host, with the listeners
// arranged just outside the ring and connected by fine lines that pass
// through the ring rather than stopping at it. Hybrid of D3 + D4 leaning
// into ambience.
const MarkConstellationHalo = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.5);
  const ringR = 14;
  const host = { x: 32, y: 32, r: 4.6 };
  const nodes = [
    { x: 8,  y: 18, r: 2.4 },
    { x: 48, y: 10, r: 2.8 },
    { x: 58, y: 38, r: 2.4 },
    { x: 36, y: 56, r: 2.6 },
    { x: 14, y: 52, r: 2.4 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {/* host's quiet ring */}
      <circle cx={host.x} cy={host.y} r={ringR}
        fill="none" stroke="currentColor" strokeWidth={lw * 0.7} opacity="0.45" />
      {/* lines from host out through the ring to each listener */}
      {nodes.map((n, i) => (
        <line key={i} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round" opacity="0.65" />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// Hub · Whisper — the same network, but the lines are dashed and a couple
// of stars sit free (no line) like distant signals. Reads as voice carrying
// rather than a wire diagram.
const MarkConstellationWhisper = ({ size = 64, weight = 2.4 }) => {
  const lw = Math.max(1, weight * 0.5);
  const host = { x: 30, y: 32, r: 4.4 };
  // 4 connected listeners + 2 free "distant signal" stars
  const linked = [
    { x: 12, y: 16, r: 2.4 },
    { x: 48, y: 12, r: 2.8 },
    { x: 56, y: 38, r: 2.2 },
    { x: 18, y: 52, r: 2.6 },
  ];
  const free = [
    { x: 40, y: 56, r: 1.8 },
    { x: 60, y: 22, r: 1.6 },
  ];
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
      {linked.map((n, i) => (
        <line key={i} x1={host.x} y1={host.y} x2={n.x} y2={n.y}
          stroke="currentColor" strokeWidth={lw} strokeLinecap="round"
          strokeDasharray="1.2 2.4" opacity="0.85" />
      ))}
      {[...linked, ...free].map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
      <circle cx={host.x} cy={host.y} r={host.r + 3.5}
        fill="none" stroke="currentColor" strokeWidth={lw} opacity="0.55" />
      <circle cx={host.x} cy={host.y} r={host.r} fill="currentColor" />
    </svg>
  );
};

// ============================================================================
// V5 — Letter direction refinements. The Hub · Letter mark earned the symbol
// by hiding a wordmark in plain sight. These push that further toward a
// "globally-recognizable monogram" — strong silhouettes, single gestures,
// cultural anchors. Each is a finished mark, not a parameter sweep.
// ============================================================================

// Letter · Stele — Two solid columns and a single host star. The most
// reduced, most monumental of the family. Reads as architecture: a doorway,
// a forum, the entrance to a room. Strongest silhouette of the set; the
// version most likely to feel iconic at scale.
const MarkLetterStele = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Left and right pillars — solid clay, slight inset from the edge */}
    <rect x="12" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    <rect x="43" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    {/* Host star — the meeting point, sized to read at 16px */}
    <circle cx="32" cy="32" r="7" fill="currentColor" />
  </svg>
);

// Letter · Hilal — The crossbar of the H becomes a crescent moon — the
// Arabic root of "Hayy" surfacing into the brand. Two thin posts, a
// horizontal crescent meeting in the middle, a small companion star tucked
// into the crescent's mouth. Most culturally grounded version; the one with
// real story.
const MarkLetterHilal = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Left post */}
    <rect x="11" y="9"  width="5" height="46" rx="1.4" fill="currentColor" />
    {/* Right post */}
    <rect x="48" y="9"  width="5" height="46" rx="1.4" fill="currentColor" />
    {/* Crescent crossbar — a "C" rotated to face up, sitting between the
        posts. Drawn as a thick arc via stroked half-ellipse. */}
    <path d="M 17 32 Q 32 18 47 32"
      fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    {/* Companion dot — the small star inside the crescent's lap */}
    <circle cx="32" cy="32.5" r="2.6" fill="currentColor" />
  </svg>
);

// Letter · Signet — A filled disc with the H carved out as negative space.
// Most "monogrammed" version of the family. Reads as a seal, a sigil, a
// member badge. Works in monochrome, works as a single-color foil stamp,
// works at favicon size.
const MarkLetterSignet = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    <path fill="currentColor" fillRule="evenodd" d="
      M 32 2
      a 30 30 0 1 0 0 60
      a 30 30 0 1 0 0 -60 Z
      M 19 16
      h 5
      v 12
      h 16
      v -12
      h 5
      v 32
      h -5
      v -14
      h -16
      v 14
      h -5 Z
    " />
  </svg>
);

// Letter · Bridge — Asymmetric H. The crossbar is dropped lower than centre
// and a single bright star sits on it — a person standing on a bridge
// between two pillars. The asymmetry is the personality; the gesture is the
// brand. Most poetic of the family, and the one most likely to grow on you.
const MarkLetterBridge = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Two tall thin pillars */}
    <rect x="12" y="6"  width="6" height="52" rx="1.6" fill="currentColor" />
    <rect x="46" y="6"  width="6" height="52" rx="1.6" fill="currentColor" />
    {/* Crossbar — set lower than centre (golden-ratio-ish), thin */}
    <rect x="14" y="40" width="36" height="3.6" rx="1.4" fill="currentColor" />
    {/* The host — a bright disc sitting on the bridge */}
    <circle cx="32" cy="41.6" r="6.4" fill="currentColor"
      stroke="currentColor" strokeWidth="2" />
    {/* Small terminal star at each pillar top — finials */}
    <circle cx="15" cy="6" r="2.6" fill="currentColor" />
    <circle cx="49" cy="6" r="2.6" fill="currentColor" />
  </svg>
);

// Letter · Aurora — H drawn with curves instead of straight lines. The two
// posts bow gently outward at the waist (like a figure, like an hourglass
// inverted) and the crossbar is a single horizontal stroke through a host
// star. Most humanistic version — softens the architecture without losing
// the letter.
const MarkLetterAurora = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Left post — gentle outward bow at the waist */}
    <path d="M 14 7 C 10 22, 10 42, 14 57"
      fill="none" stroke="currentColor" strokeWidth="5.2"
      strokeLinecap="round" />
    {/* Right post — mirrored */}
    <path d="M 50 7 C 54 22, 54 42, 50 57"
      fill="none" stroke="currentColor" strokeWidth="5.2"
      strokeLinecap="round" />
    {/* Crossbar — straight, thin, passes behind the host */}
    <line x1="14" y1="32" x2="50" y2="32"
      stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    {/* Host star on the crossbar */}
    <circle cx="32" cy="32" r="6.4" fill="currentColor" />
  </svg>
);

// Letter · Lowercase ḥ — Single-gesture lowercase 'h' with a star where the
// ascender begins. Matches the lowercase italic "h" already in the brand
// chrome — most "warm and human" of the family. The version that scales
// down to a tab-bar icon without losing its personality.
const MarkLetterLowercase = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* The ascender + bowl, drawn as a single stroked path */}
    <path d="M 18 6 L 18 58 M 18 30 C 18 20, 46 20, 46 32 L 46 58"
      fill="none" stroke="currentColor" strokeWidth="7"
      strokeLinecap="round" strokeLinejoin="round" />
    {/* Star at the top of the ascender — the "i-dot" of the h */}
    <circle cx="18" cy="9" r="5.6" fill="currentColor"
      stroke="currentColor" strokeWidth="2" />
  </svg>
);

// ============================================================================
// V6 — Stele direction. The chosen mark. Two pillars + a host star is the
// strongest silhouette of the family; these refinements explore six
// different ways to give that gesture a personality without losing what
// makes it iconic.
// ============================================================================

// Stele · Capstone — Classical capitals (and matching bases) on each pillar.
// The architectural reference is explicit: ionic columns, the entrance to a
// hall, a building that will still be standing. Most "prestigious" of the
// family.
const MarkSteleCapstone = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Left pillar — slightly inset from the top/bottom caps */}
    <rect x="13" y="15" width="7" height="34" rx="1.6" fill="currentColor" />
    {/* Left capital (top) */}
    <rect x="10" y="10" width="13" height="5" rx="1.4" fill="currentColor" />
    {/* Left base (bottom) */}
    <rect x="10" y="49" width="13" height="5" rx="1.4" fill="currentColor" />
    {/* Right pillar */}
    <rect x="44" y="15" width="7" height="34" rx="1.6" fill="currentColor" />
    {/* Right capital + base */}
    <rect x="41" y="10" width="13" height="5" rx="1.4" fill="currentColor" />
    <rect x="41" y="49" width="13" height="5" rx="1.4" fill="currentColor" />
    {/* Host star */}
    <circle cx="32" cy="32" r="6.6" fill="currentColor" />
  </svg>
);

// Stele · Tapered — Obelisk pillars, narrower at the top than the base.
// Imports the gravity of monuments without being heavy. The version that
// looks engraved.
const MarkSteleTapered = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Left obelisk — wider at bottom */}
    <path d="M 14 56 L 21 56 L 19.5 8 L 15.5 8 Z" fill="currentColor" />
    {/* Right obelisk */}
    <path d="M 43 56 L 50 56 L 48.5 8 L 44.5 8 Z" fill="currentColor" />
    {/* Host star — sits centred between them */}
    <circle cx="32" cy="32" r="6.8" fill="currentColor" />
  </svg>
);

// Stele · Twin — Two stars between the pillars instead of one. The visual
// signature of the double-Y in HAYY, made literal. A pair, a conversation,
// two people on stage.
const MarkSteleTwin = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    <rect x="12" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    <rect x="43" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    {/* Two host stars — vertically stacked, slightly tucked toward centre */}
    <circle cx="32" cy="23" r="5.4" fill="currentColor" />
    <circle cx="32" cy="41" r="5.4" fill="currentColor" />
  </svg>
);

// Stele · Lantern — Same architecture, but the host gets a soft outer ring
// (an echo of the Aperture mark). Reads as a lamp hanging in the doorway —
// the most ambient and atmospheric of the family.
const MarkSteleLantern = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    <rect x="12" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    <rect x="43" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    {/* Soft halo around the host */}
    <circle cx="32" cy="32" r="11.5" fill="none"
      stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
    {/* Host */}
    <circle cx="32" cy="32" r="6.4" fill="currentColor" />
  </svg>
);

// Stele · Bridged — A thin horizontal connector passes through the host,
// linking the two pillars. The clearest "H" of the family; reads as a
// letterform first, a constellation second. Useful when the wordmark is
// absent and the mark has to do the talking alone.
const MarkSteleBridged = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    <rect x="12" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    <rect x="43" y="9"  width="9" height="46" rx="2.2" fill="currentColor" />
    {/* Thin connector through centre */}
    <rect x="20" y="30" width="24" height="4" rx="1.6" fill="currentColor" />
    {/* Host sits on top */}
    <circle cx="32" cy="32" r="6.6" fill="currentColor" />
  </svg>
);

// Stele · Floating — The pillars stop before they reach the host star;
// there's clear sky around it. The most ethereal version — the mark
// becomes a doorway with light coming through. Pairs well with the dusk
// palette; especially good as a brand animation (the star can rise).
const MarkSteleFloating = ({ size = 64, weight = 2.4 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} aria-label="Hayy">
    {/* Left pillar split top/bottom around the host */}
    <rect x="12" y="9"  width="9" height="16" rx="2"   fill="currentColor" />
    <rect x="12" y="39" width="9" height="16" rx="2"   fill="currentColor" />
    {/* Right pillar split */}
    <rect x="43" y="9"  width="9" height="16" rx="2"   fill="currentColor" />
    <rect x="43" y="39" width="9" height="16" rx="2"   fill="currentColor" />
    {/* Host — slightly larger to fill the gap */}
    <circle cx="32" cy="32" r="7.4" fill="currentColor" />
  </svg>
);

const MARKS = {
  // Earlier explorations (kept so v1 + v2 still work)
  hexa:         { id: 'hexa',         name: 'Hexa-H',        tagline: 'Refined geometry · keeps the hexagon DNA, but legible', Comp: MarkHexaH },
  crescent:     { id: 'crescent',     name: 'Hilal',         tagline: 'Crescent + companion dot · evening, presence',           Comp: MarkCrescent },
  aperture:     { id: 'aperture',     name: 'Aperture',      tagline: 'Concentric · "alive", presence, the live room',          Comp: MarkAperture },
  pulse:        { id: 'pulse',        name: 'Pulse',         tagline: 'A room with someone in it · best at small sizes',        Comp: MarkPulse },
  orbit:        { id: 'orbit',        name: 'Orbit',         tagline: 'One host, one satellite · an intimate pair',             Comp: MarkOrbit },
  echo:         { id: 'echo',         name: 'Echo',          tagline: 'Source + ripples · voice carrying, attention spreading',  Comp: MarkEcho },
  halo:         { id: 'halo',         name: 'Halo',          tagline: 'Host + ring of listeners · a packed circle',             Comp: MarkHalo },
  // Atrium family (v3 refinement)
  atriumIntimate: { id: 'atriumIntimate', name: 'Atrium · Intimate', tagline: '5 listeners · quieter, more breathing room',     Comp: MarkAtriumIntimate },
  atrium:         { id: 'atrium',         name: 'Atrium · Balanced', tagline: '7 listeners · the original',                        Comp: MarkAtrium },
  atriumFull:     { id: 'atriumFull',     name: 'Atrium · Full',     tagline: '13 listeners · a packed circle',                    Comp: MarkAtriumFull },
  // Constellation family (v3 refinement)
  constellationPair: { id: 'constellationPair', name: 'Constellation · Trio', tagline: '3 listeners · most poetic',                Comp: MarkConstellationPair },
  constellation:     { id: 'constellation',     name: 'Constellation · Hub',  tagline: '5 listeners, hub-and-spoke · the original',Comp: MarkConstellation },
  constellationWeb:  { id: 'constellationWeb',  name: 'Constellation · Web',  tagline: '5 listeners, fully connected · group feel',Comp: MarkConstellationWeb },
  // Hub direction refinements (v4)
  hubStarweight: { id: 'hubStarweight', name: 'Hub · Starweight', tagline: 'Varied star sizes + irregular angles · the most lived-in', Comp: MarkConstellationStarweight },
  hubLetter:     { id: 'hubLetter',     name: 'Hub · Letter',     tagline: 'The lines spell an H through the host · hidden ligature', Comp: MarkConstellationLetter },
  hubTilted:     { id: 'hubTilted',     name: 'Hub · Tilted',     tagline: 'Rotated, host off-center · found object, not a stamp',     Comp: MarkConstellationTilted },
  hubBeam:       { id: 'hubBeam',       name: 'Hub · Beam',       tagline: 'Directional beams to varied stars · broadcast, not network',Comp: MarkConstellationBeam },
  hubHalo:       { id: 'hubHalo',       name: 'Hub · Halo',       tagline: 'Aperture’s ring + listeners just outside · hybrid, ambient', Comp: MarkConstellationHalo },
  hubWhisper:    { id: 'hubWhisper',    name: 'Hub · Whisper',    tagline: 'Dashed lines + free signals · voice carrying, not wires',  Comp: MarkConstellationWhisper },
  // Letter direction refinements (v5) — push to prestige / iconic
  letterStele:     { id: 'letterStele',     name: 'Letter · Stele',     tagline: 'Two solid pillars + a host star · monumental, reduced',     Comp: MarkLetterStele },
  letterHilal:     { id: 'letterHilal',     name: 'Letter · Hilal',     tagline: 'Crescent crossbar · the Arabic root of Hayy, surfaced',     Comp: MarkLetterHilal },
  letterSignet:    { id: 'letterSignet',    name: 'Letter · Signet',    tagline: 'Negative-space H carved from a disc · a sealed monogram',  Comp: MarkLetterSignet },
  letterBridge:    { id: 'letterBridge',    name: 'Letter · Bridge',    tagline: 'Dropped crossbar, host on the bridge · asymmetric, poetic',  Comp: MarkLetterBridge },
  letterAurora:    { id: 'letterAurora',    name: 'Letter · Aurora',    tagline: 'Curved posts · humanistic, softens the architecture',       Comp: MarkLetterAurora },
  letterLowercase: { id: 'letterLowercase', name: 'Letter · Lowercase', tagline: 'Single-gesture lowercase ĥ · matches the brand’s h-chip', Comp: MarkLetterLowercase },
  // Stele direction refinements (v6)
  steleCapstone:   { id: 'steleCapstone',   name: 'Stele · Capstone',   tagline: 'Classical capitals + bases · the architectural monument',  Comp: MarkSteleCapstone },
  steleTapered:    { id: 'steleTapered',    name: 'Stele · Tapered',    tagline: 'Obelisk pillars · engraved, eternal',                       Comp: MarkSteleTapered },
  steleTwin:       { id: 'steleTwin',       name: 'Stele · Twin',       tagline: 'Two host stars · the double-Y in HAYY, made literal',       Comp: MarkSteleTwin },
  steleLantern:    { id: 'steleLantern',    name: 'Stele · Lantern',    tagline: 'Star with a soft halo · a lamp in the doorway',             Comp: MarkSteleLantern },
  steleBridged:    { id: 'steleBridged',    name: 'Stele · Bridged',    tagline: 'Thin connector through the host · reads clearest as H',     Comp: MarkSteleBridged },
  steleFloating:   { id: 'steleFloating',   name: 'Stele · Floating',   tagline: 'Split pillars, star in the gap · most ethereal',           Comp: MarkSteleFloating },
  // Convene family (v3 refinement)
  conveneSparse:     { id: 'conveneSparse', name: 'Convene · Sparse',  tagline: '6 dots · the quietest version',                Comp: MarkConveneSparse },
  convene:           { id: 'convene',       name: 'Convene · Cluster', tagline: '10 dots, balanced · the original',            Comp: MarkConvene },
  conveneDrift:      { id: 'conveneDrift',  name: 'Convene · Drift',   tagline: '10 dots leaning right · the room turning to listen', Comp: MarkConveneDrift },
};

// ============================================================================
// WORDMARK
// ============================================================================

// Custom wordmark. Letter-spaced display caps, with the option of a serif or
// grotesk treatment. The double-Y is the visual signature — kept upright,
// slightly tightened in the middle so it reads as a pair.
const Wordmark = ({ size = 28, weight = 500, font = 'serif', tracking = 0.28, color }) => {
  const family = font === 'serif'
    ? "'Fraunces', 'Cormorant Garamond', Georgia, serif"
    : "'Inter Tight', 'Inter', system-ui, sans-serif";
  return (
    <span style={{
      fontFamily: family,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: `${tracking}em`,
      paddingLeft: `${tracking}em`, // optical center for tracked text
      color: color || 'currentColor',
      lineHeight: 1,
      display: 'inline-block',
      fontFeatureSettings: '"ss01"',
    }}>HAYY</span>
  );
};

// ============================================================================
// LOCKUPS
// ============================================================================

const LockupStacked = ({ markKey, size = 96, font = 'serif' }) => {
  const { Comp } = MARKS[markKey];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.22 }}>
      <Comp size={size} weight={2.2} />
      <Wordmark size={size * 0.22} font={font} tracking={0.36} />
    </div>
  );
};

const LockupHorizontal = ({ markKey, size = 56, font = 'serif' }) => {
  const { Comp } = MARKS[markKey];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.34 }}>
      <Comp size={size} weight={2.4} />
      <Wordmark size={size * 0.42} font={font} tracking={0.28} />
    </div>
  );
};

// ============================================================================
// IN-CONTEXT TESTS
// ============================================================================

// A realistic Hayy nav bar — left logo, center links, right action.
const NavbarContext = ({ markKey, palette = 'warm', font = 'serif' }) => {
  const isDusk = palette === 'dusk';
  const bg = isDusk ? 'hsl(228 20% 10%)' : 'hsl(36 32% 96%)';
  const paper = isDusk ? 'hsl(228 18% 13%)' : 'hsl(36 42% 98%)';
  const ink = isDusk ? 'hsl(36 30% 95%)' : 'hsl(20 25% 13%)';
  const inkSoft = isDusk ? 'hsl(228 12% 70%)' : 'hsl(20 14% 38%)';
  const line = isDusk ? 'hsl(228 14% 22%)' : 'hsl(30 18% 86%)';
  const clay = isDusk ? 'hsl(28 78% 62%)' : 'hsl(18 58% 38%)';
  const { Comp } = MARKS[markKey];

  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: ink,
      fontFamily: "'Inter', system-ui, sans-serif", padding: 0,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px', borderBottom: `1px solid ${line}`, background: paper,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: clay }}>
          <Comp size={28} weight={2.4} />
          <Wordmark size={13} font={font} tracking={0.34} />
        </div>
        {/* Links */}
        <div style={{ display: 'flex', gap: 28, color: inkSoft, fontSize: 13, fontWeight: 500 }}>
          <span style={{ color: ink }}>Rooms</span>
          <span>Referrals</span>
          <span>Library</span>
          <span>Members</span>
        </div>
        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 999, border: `1px solid ${line}`,
            fontSize: 11, color: inkSoft, textTransform: 'uppercase', letterSpacing: '.08em',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'hsl(8 78% 56%)',
              boxShadow: '0 0 0 3px hsl(8 80% 56% / .2)',
            }} />
            Live · 3
          </div>
          <button style={{
            background: clay, color: paper, border: 'none', borderRadius: 999,
            padding: '8px 16px', fontFamily: 'inherit', fontWeight: 500, fontSize: 13,
            cursor: 'pointer',
          }}>Join tonight</button>
        </div>
      </div>

      {/* Page body — soft so it doesn't compete */}
      <div style={{ flex: 1, padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 28, letterSpacing: '-0.02em', color: ink, fontWeight: 500,
        }}>Tonight at Hayy</div>
        <div style={{ color: inkSoft, fontSize: 13, maxWidth: 480, lineHeight: 1.5 }}>
          Three rooms open. The host is warming up the floor — pull up a seat,
          listen in, and step up when you're ready.
        </div>
        <div style={{
          marginTop: 8, display: 'flex', gap: 12,
        }}>
          {['Couch', 'Stage', 'Garden'].map(name => (
            <div key={name} style={{
              flex: 1, height: 92, background: paper, border: `1px solid ${line}`,
              borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 15, color: ink }}>{name}</div>
              <div style={{ fontSize: 11, color: inkSoft }}>4 listeners · 1 speaker</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Favicon / browser tab simulation — square chips at real sizes (16, 24, 32, 48px)
const FaviconRow = ({ markKey, palette = 'warm' }) => {
  const isDusk = palette === 'dusk';
  const bg = isDusk ? 'hsl(228 18% 13%)' : 'hsl(36 42% 98%)';
  const ink = isDusk ? 'hsl(36 30% 95%)' : 'hsl(18 58% 38%)';
  const inkMute = isDusk ? 'hsl(228 10% 55%)' : 'hsl(20 10% 55%)';
  const line = isDusk ? 'hsl(228 14% 22%)' : 'hsl(30 18% 86%)';
  const { Comp } = MARKS[markKey];

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', gap: 28,
      padding: 28, background: bg, borderRadius: 12, border: `1px solid ${line}`,
      color: ink, width: '100%', boxSizing: 'border-box',
    }}>
      {[16, 24, 32, 48].map(s => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: s, height: s, display: 'flex', alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Comp size={s} weight={s < 24 ? 3.2 : 2.6} />
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 10, color: inkMute, letterSpacing: '.04em',
          }}>{s}px</div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// SHOWCASE CARDS (used inside DCArtboards)
// ============================================================================

// Big centered mark on a palette background.
const MarkPlate = ({ markKey, palette = 'warm', label }) => {
  const isDusk = palette === 'dusk';
  const bg = isDusk ? 'hsl(228 20% 10%)' : 'hsl(36 32% 96%)';
  const ink = isDusk ? 'hsl(28 78% 62%)' : 'hsl(18 58% 38%)';
  const inkMute = isDusk ? 'hsl(228 10% 55%)' : 'hsl(20 10% 55%)';
  const line = isDusk ? 'hsl(228 14% 22%)' : 'hsl(30 18% 86%)';
  const { Comp } = MARKS[markKey];
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: ink,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 22, position: 'relative',
    }}>
      <Comp size={200} weight={2.0} />
      {label && (
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10, color: inkMute, letterSpacing: '.06em', textTransform: 'uppercase',
        }}>{label}</div>
      )}
    </div>
  );
};

// Two lockups (stacked + horizontal) side by side on a paper bg.
const LockupPlate = ({ markKey, palette = 'warm', font = 'serif' }) => {
  const isDusk = palette === 'dusk';
  const bg = isDusk ? 'hsl(228 18% 13%)' : 'hsl(36 42% 98%)';
  const ink = isDusk ? 'hsl(28 78% 62%)' : 'hsl(18 58% 38%)';
  const inkMute = isDusk ? 'hsl(228 10% 55%)' : 'hsl(20 10% 55%)';
  const line = isDusk ? 'hsl(228 14% 22%)' : 'hsl(30 18% 86%)';
  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: ink,
      display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRight: `1px solid ${line}`, position: 'relative',
      }}>
        <LockupStacked markKey={markKey} size={120} font={font} />
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10, color: inkMute, letterSpacing: '.06em', textTransform: 'uppercase',
        }}>stacked</div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <LockupHorizontal markKey={markKey} size={72} font={font} />
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: 10, color: inkMute, letterSpacing: '.06em', textTransform: 'uppercase',
        }}>horizontal</div>
      </div>
    </div>
  );
};

// Title card describing the direction.
const DirectionIntro = ({ name, tagline, n, total, palette = 'warm', markKey, font = 'serif' }) => {
  const isDusk = palette === 'dusk';
  const bg = isDusk ? 'hsl(228 18% 13%)' : 'hsl(36 42% 98%)';
  const ink = isDusk ? 'hsl(36 30% 95%)' : 'hsl(20 25% 13%)';
  const inkSoft = isDusk ? 'hsl(228 12% 70%)' : 'hsl(20 14% 38%)';
  const inkMute = isDusk ? 'hsl(228 10% 55%)' : 'hsl(20 10% 55%)';
  const clay = isDusk ? 'hsl(28 78% 62%)' : 'hsl(18 58% 38%)';
  const line = isDusk ? 'hsl(228 14% 22%)' : 'hsl(30 18% 86%)';
  const { Comp } = MARKS[markKey];

  return (
    <div style={{
      width: '100%', height: '100%', background: bg, color: ink,
      padding: '32px 28px', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
        fontSize: 10, color: inkMute, letterSpacing: '.08em', textTransform: 'uppercase',
      }}>
        <span>Direction {n} of {total}</span>
        <span>Hayy / Logo</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, color: clay }}>
        <Comp size={88} weight={2.2} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: 36, letterSpacing: '-0.02em', fontWeight: 500, color: ink,
        }}>{name}</div>
        <div style={{ color: inkSoft, fontSize: 13, lineHeight: 1.5, maxWidth: 280 }}>
          {tagline}
        </div>
      </div>
    </div>
  );
};

// Expose globally so other Babel scripts and the main HTML can use them.
Object.assign(window, {
  MARKS,
  MarkHexaH, MarkCrescent, MarkAperture, MarkConstellation, MarkPulse,
  MarkOrbit, MarkEcho, MarkHalo, MarkAtrium, MarkConvene,
  MarkAtriumIntimate, MarkAtriumFull,
  MarkConstellationPair, MarkConstellationWeb,
  MarkConveneSparse, MarkConveneDrift,
  MarkConstellationStarweight, MarkConstellationLetter, MarkConstellationTilted,
  MarkConstellationBeam, MarkConstellationHalo, MarkConstellationWhisper,
  MarkLetterStele, MarkLetterHilal, MarkLetterSignet,
  MarkLetterBridge, MarkLetterAurora, MarkLetterLowercase,
  MarkSteleCapstone, MarkSteleTapered, MarkSteleTwin,
  MarkSteleLantern, MarkSteleBridged, MarkSteleFloating,
  Wordmark, LockupStacked, LockupHorizontal,
  NavbarContext, FaviconRow,
  MarkPlate, LockupPlate, DirectionIntro,
});
