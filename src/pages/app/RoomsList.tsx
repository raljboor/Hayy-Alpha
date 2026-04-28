import { useState } from "react";
import { SectionHeader } from "@/components/hayy/SectionHeader";
import { RoomCard } from "@/components/hayy/RoomCard";
import { EmptyState } from "@/components/hayy/EmptyState";
import { ErrorState } from "@/components/hayy/ErrorState";
import { RoomCardSkeleton } from "@/components/hayy/Skeletons";
import { getRooms } from "@/lib/api/rooms";
import { useAsync } from "@/lib/useAsync";
import { Input } from "@/components/ui/input";
import { Search, Mic } from "lucide-react";

const filters = [
  "All",
  "Operations",
  "Tech",
  "Finance",
  "Newcomers",
  "Product",
  "Consulting",
  "Canada",
  "MENA community",
] as const;

const RoomsList = () => {
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const [q, setQ] = useState("");
  const { data: rooms, loading, error, refetch } = useAsync(() => getRooms(), []);

  const list = (rooms ?? []).filter((r) => {
    if (filter !== "All") {
      const hay = `${r.category} ${r.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(filter.toLowerCase())) return false;
    }
    if (q && !`${r.title} ${r.company} ${r.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Live community"
        title="Live career rooms"
        description="Drop into live conversations with people inside the companies you care about."
      />

      <div className="space-y-4">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms, companies, topics…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 bg-card"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card text-foreground/70 border-border hover:bg-sand"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <RoomCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load rooms right now." onRetry={refetch} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={Mic}
          title="No rooms match yet"
          description="Try a different filter or search term — new rooms drop every week."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((r) => <RoomCard key={r.id} room={r} />)}
        </div>
      )}
    </div>
  );
};
export default RoomsList;
