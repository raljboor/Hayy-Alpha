// Mock client-side auth used until a real backend is wired up.
// Logged-out users should never reach /app/* pages.

import { useEffect, useState } from "react";

const KEY = "hayy.authed";
const EVT = "hayy:auth-change";

export const isAuthed = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
};

export const signIn = () => {
  window.localStorage.setItem(KEY, "1");
  window.dispatchEvent(new Event(EVT));
};

export const signOut = () => {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
};

export const useAuth = () => {
  const [authed, setAuthed] = useState<boolean>(isAuthed());
  useEffect(() => {
    const handler = () => setAuthed(isAuthed());
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return { authed, signIn, signOut };
};
