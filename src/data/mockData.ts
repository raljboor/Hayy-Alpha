/**
 * Centralized mock data for the Hayy frontend prototype.
 *
 * Pages import from here (or from `src/lib/api/*`) so swapping in
 * Supabase later only requires editing the API layer.
 *
 * Re-exports the existing mock fixtures so we have a single import surface.
 */

export * from "@/lib/mockData";
export * from "@/lib/inboxData";
