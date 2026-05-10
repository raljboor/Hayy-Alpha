/**
 * Palette toggle — flips between the redesign's "warm" (light) and "dusk"
 * (dark) palettes by setting `data-palette` on <html>.
 *
 * The CSS for both palettes is already in src/index.css under `.hy` and
 * `.hy[data-palette="dusk"]` selectors (one of which matches when an
 * ancestor — including <html> — carries the attribute), so this module
 * only manages state, not styles.
 *
 * Storage:
 *   - localStorage key:           "hayy.palette" → "warm" | "dusk"
 *   - on first load with no key:  uses prefers-color-scheme: dark
 *   - subsequent loads:           reads localStorage
 *
 * Cross-tab: storage events keep multiple open tabs in sync. Within a
 * single tab, components subscribe via the custom "hayy:palette-change"
 * event so calling setPalette() re-renders every consumer.
 */

import { useEffect, useState } from "react";

export type Palette = "warm" | "dusk";

const STORAGE_KEY = "hayy.palette";
const EVENT = "hayy:palette-change";

function readStored(): Palette | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "warm" || raw === "dusk") return raw;
  return null;
}

function detectOSPreference(): Palette {
  if (typeof window === "undefined" || !window.matchMedia) return "warm";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dusk" : "warm";
}

function applyToDom(palette: Palette) {
  if (typeof document === "undefined") return;
  if (palette === "dusk") {
    document.documentElement.dataset.palette = "dusk";
  } else {
    delete document.documentElement.dataset.palette;
  }
}

/**
 * Module-level init — call once from main.tsx so the palette is applied
 * before the first paint. Reads localStorage, falls back to OS pref.
 */
export function initPalette(): void {
  const initial = readStored() ?? detectOSPreference();
  applyToDom(initial);
}

/**
 * Sets the palette: persists to localStorage, applies to <html>, and
 * notifies subscribers (hooks via useSyncExternalStore-like pattern below).
 */
export function setPalette(next: Palette): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, next);
  applyToDom(next);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
}

/**
 * Returns the current palette + a setter. Subscribes to:
 *   - the in-tab "hayy:palette-change" custom event (own setPalette calls)
 *   - the cross-tab "storage" event (other tab toggled it)
 *   - the OS-level prefers-color-scheme media query (if the user hasn't
 *     made an explicit choice yet, follow OS changes live)
 */
export function usePalette(): { palette: Palette; setPalette: typeof setPalette } {
  const [palette, setLocalPalette] = useState<Palette>(
    () => readStored() ?? detectOSPreference(),
  );

  useEffect(() => {
    const sync = () => setLocalPalette(readStored() ?? detectOSPreference());

    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<Palette>).detail;
      if (detail === "warm" || detail === "dusk") setLocalPalette(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) sync();
    };
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onMql = () => {
      // Only follow OS changes when no explicit user choice is stored.
      if (!readStored()) sync();
    };

    window.addEventListener(EVENT, onCustom as EventListener);
    window.addEventListener("storage", onStorage);
    mql?.addEventListener?.("change", onMql);

    return () => {
      window.removeEventListener(EVENT, onCustom as EventListener);
      window.removeEventListener("storage", onStorage);
      mql?.removeEventListener?.("change", onMql);
    };
  }, []);

  return { palette, setPalette };
}
