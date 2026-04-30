import { useState } from "react";
import { SectionHeader } from "@/components/hayy/SectionHeader";
import { RoomCard } from "@/components/hayy/RoomCard";
import { EmptyState } from "@/components/hayy/EmptyState";
import { ErrorState } from "@/components/hayy/ErrorState";
import { RoomCardSkeleton } from "@/components/hayy/Skeletons";
import { getRooms, createRoom } from "@/lib/api/rooms";
import { useAsync } from "@/lib/useAsync";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Mic, Plus } from "lucide-react";

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
  const { userId, profile, isAuthenticated } = useCurrentUser();

  // Create Room dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formRoomType, setFormRoomType] = useState<"community" | "referral" | "hiring">("community");
  const [formStartsAt, setFormStartsAt] = useState("");

  const isRecruiter =
    profile?.role_type === "recruiter" || profile?.role_type === "admin";

  // Deduplicate by room.id, keeping the first occurrence
  const seen = new Set<string>();
  const deduped = (rooms ?? []).filter((r) => {
    if (seen.has(r.id)) {
      if (import.meta.env.DEV) {
        console.warn("[RoomsList] Duplicate room id skipped:", r.id, r.title);
      }
      return false;
    }
    seen.add(r.id);
    return true;
  });

  const list = deduped.filter((r) => {
    if (filter !== "All") {
      const hay = `${r.category} ${r.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(filter.toLowerCase())) return false;
    }
    if (
      q &&
      !`${r.title} ${r.company} ${r.tags.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase())
    )
      return false;
    return true;
  });

  function resetForm() {
    setFormTitle("");
    setFormDescription("");
    setFormRoomType("community");
    setFormStartsAt("");
  }

  async function handleCreate() {
    if (!formTitle.trim() || !userId) return;
    setCreating(true);
    try {
      await createRoom({
        title: formTitle.trim(),
        description: formDescription.trim(),
        room_type: formRoomType,
        hostId: userId,
        startsAt: formStartsAt || new Date().toISOString(),
        status: "upcoming",
      });
      toast.success("Room created", { description: "Your room is now live." });
      setDialogOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create room.");
    } finally {
      setCreating(false);
    }
  }

  const createRoomButton = (
    <Button size="sm" onClick={() => setDialogOpen(true)}>
      <Plus className="h-4 w-4 mr-1.5" />
      Create Room
    </Button>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Live community"
          title="Live career rooms"
          description="Drop into live conversations with people inside the companies you care about."
        />
        {isAuthenticated && <div className="shrink-0 mt-1">{createRoomButton}</div>}
      </div>

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
          {Array.from({ length: 6 }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load rooms right now." onRetry={refetch} />
      ) : list.length === 0 ? (
        isSupabaseConfigured ? (
          <EmptyState
            icon={Mic}
            title="No rooms yet"
            description="Create the first room for the community."
            action={isAuthenticated ? createRoomButton : undefined}
          />
        ) : (
          <EmptyState
            icon={Mic}
            title="No rooms match yet"
            description="Try a different filter or search term — new rooms drop every week."
          />
        )
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create a room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="e.g. Breaking into product at a startup"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="What will you talk about?"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Room type</label>
              <Select
                value={formRoomType}
                onValueChange={(v) =>
                  setFormRoomType(v as "community" | "referral" | "hiring")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  {isRecruiter && (
                    <SelectItem value="hiring">Hiring</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Scheduled time</label>
              <Input
                type="datetime-local"
                value={
                  formStartsAt
                    ? new Date(formStartsAt).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setFormStartsAt(
                    e.target.value ? new Date(e.target.value).toISOString() : ""
                  )
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={creating || !formTitle.trim()}
            >
              {creating ? "Creating…" : "Create Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default RoomsList;
