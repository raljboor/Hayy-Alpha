# Hayy — Logo asset kit

The mark is **two pillars and a host star** — an entryway, a forum, a
doorway to a live room. Single-shape, monochrome, currentColor-driven.
Built to live everywhere: from a 16-pixel favicon to a building.

## Files

| File | When to use |
|---|---|
| `hayy-mark.svg` | The mark, `currentColor` — drop into HTML/CSS and color it via `color:`. The canonical version. |
| `hayy-mark-clay.svg` | Mark with the brand clay (`#8A3A1F`) baked in. Use on light backgrounds when the host environment can't theme SVG. |
| `hayy-mark-paper.svg` | Inverse — paper (`#F7F1E4`) baked in, for dark backgrounds. |
| `hayy-mark-ink.svg` | Ink (`#0E0F14`) baked in, for max-contrast monochrome. |
| `hayy-lockup-horizontal.svg` | Mark + HAYY wordmark, side by side. The default branded usage. |
| `hayy-lockup-stacked.svg` | Mark above the wordmark. For square crops, posters, splash screens. |
| `favicon.svg` | Hand-tuned for 16/32 px sizes — slightly thicker pillars so it doesn't disappear in a tab. |
| `app-icon.svg` | 1024×1024 rounded-square iOS-style icon. Paper mark on clay backplate. |
| `HayyLogo.jsx` | Drop-in React component (`<HayyMark />` and `<HayyLockup />`). |

## Brand colors

| Token | Value | Use |
|---|---|---|
| Clay | `#8A3A1F` | Primary brand color. The mark on light. |
| Clay (dusk) | `oklch(0.72 0.13 35)` ≈ `#E88452` | Brighter alternate for dark palettes. |
| Paper | `#F7F1E4` | Light background; inverse mark on dark. |
| Ink | `#0E0F14` | Body text / max contrast monochrome. |
| Cream | `#F2EAD8` | Subdued surfaces, card backgrounds. |

## HTML / CSS — copy-paste

```html
<!-- Inherits color from the parent. Style the size + color in CSS. -->
<img src="/logo/hayy-mark.svg" class="hayy" alt="Hayy" />

<style>
  .hayy { width: 28px; height: 28px; color: #8A3A1F; }
</style>
```

If you want the mark to live in a button or chip and theme dynamically,
inline the SVG and use `currentColor`:

```html
<a class="brand" href="/">
  <svg viewBox="0 0 64 64" width="28" height="28" fill="currentColor" aria-label="Hayy">
    <rect x="12" y="9" width="9" height="46" rx="2.2"/>
    <rect x="43" y="9" width="9" height="46" rx="2.2"/>
    <circle cx="32" cy="32" r="7"/>
  </svg>
  <span class="word">HAYY</span>
</a>

<style>
  .brand { display: inline-flex; align-items: center; gap: 12px; color: #8A3A1F; }
  .brand .word {
    font-family: 'Fraunces', Georgia, serif;
    font-weight: 500;
    letter-spacing: 0.18em;
    color: #0E0F14;
  }
</style>
```

## React — copy-paste

```jsx
import { HayyMark, HayyLockup } from './HayyLogo.jsx';

<HayyMark size={32} style={{ color: '#8A3A1F' }} />
<HayyLockup size={36} style={{ color: '#0E0F14' }} />
```

## Favicon — drop into `<head>`

```html
<link rel="icon" type="image/svg+xml" href="/logo/favicon.svg" />
<link rel="apple-touch-icon" href="/logo/app-icon.svg" />
```

For platforms that don't accept SVG (e.g. some legacy Safari versions),
also export `favicon-32.png`, `favicon-16.png`, and `apple-touch-icon-180.png`
from the SVGs — any vector tool can do this.

## Sizing

The mark is built on a 64×64 grid. It will render crisp at any size, but
the practical floor is **16 px** — at smaller sizes the pillars and the
star start to merge. Use `favicon.svg` instead, which is tuned for that.

## Clear space

Around the mark, reserve clear space equal to the **diameter of the host
star** (≈ 22% of the mark's height). The wordmark in the horizontal
lockup is already aligned to this rule.

## Do

- Use the mark in a single brand color — clay, ink, or paper.
- Pair with Fraunces (display) and Inter (body).
- Let it inherit from the surrounding text color when it makes sense.

## Don't

- Outline it. The pillars are solid; outlining them turns the mark into
  a different mark.
- Add a stroke to the host star. Same reason.
- Rotate, skew, distort, or apply drop shadows.
- Use it on a low-contrast background — clay on cream is too close.
- Recreate it from memory. Use the SVG.
