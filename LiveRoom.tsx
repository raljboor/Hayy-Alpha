import { Link, useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Hand,
  MessageSquareQuote,
  Handshake,
  LogOut,
  Send,
  MoreVertical,
  Volume2,
  Crown,
  X,
} from "lucide-react";
import { getRoom, getUser, users } from "@/lib/mockData";
import { UserAvatar } from "@/components/hayy/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const sampleQuestions = [
  { id: "q1", userId: "u1", text: "How do referrals actually work?", upvotes: 24 },
  { id: "q2", userId: "u5", text: "What makes someone referral-ready?", upvotes: 18 },
  { id: "q3", userId: "u3", text: "Should I message before or after applying?", upvotes: 12 },
  { id: "q4", userId: "u4", text: "How do I follow up without being annoying?", upvotes: 9 },
];

type Tile = {
  id: string;
  user: ReturnType<typeof getUser>;
  isHost?: boolean;
  isSpeaker: boolean;
  speaking?: boolean;
  hasVideo?: boolean;
  muted?: boolean;
};

const LiveRoom = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const room = getRoom(id);

  const [muted, setMuted] = useState(true);
  const [video, setVideo] = useState(false);
  const [hand, setHand] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [chatText, setChatText] = useState("");
  const [questions, setQuestions] = useState(sampleQuestions);

  const tiles: Tile[] = useMemo(() => {
    const pool = users.concat(users).slice(0, 8);
    return pool.map((u, i) => ({
      id: `${u.id}-${i}`,
      user: u,
      isHost: i === 0,
      isSpeaker: i < 4,
      speaking: i === 1 || i === 2,
      hasVideo: i === 0 || i === 3,
      muted: i === 3,
    }));
  }, []);

  const raisedHands = [users[4], users[5]];
  const audienceCount = (room?.attendees ?? 100) - tiles.filter((t) => t.isSpeaker).length;

  if (!room) return null;

  const submitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    setReferralOpen(false);
    toast.success("Request sent", { description: "Your host will get a warm intro request." });
  };

  const submitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestions([
      { id: `q${Date.now()}`, userId: users[0].id, text: questionText.trim(), upvotes: 1 },
      ...questions,
    ]);
    setQuestionText("");
    setQuestionOpen(false);
    toast.success("Question added to the queue");
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    setQuestions([
      { id: `q${Date.now()}`, userId: users[0].id, text: chatText.trim(), upvotes: 1 },
      ...questions,
    ]);
    setChatText("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-background to-cream/40 flex flex-col">
      {/* Top bar */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-clay/15 text-clay border border-clay/30 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-clay opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-clay" />
            </span>
            Live now
          </span>
          <p className="font-display text-base sm:text-lg truncate max-w-[55vw]">
            Breaking Into Corporate Roles in Canada
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate(`/app/rooms/${room.id}`)}>
          <LogOut className="h-4 w-4" />Leave
        </Button>
      </header>

      <div className="flex-1 grid lg:grid-cols-[1fr_360px] overflow-hidden">
        {/* Stage */}
        <section className="overflow-y-auto p-5 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium uppercase tracking-widest text-clay">
              On stage · {tiles.filter((t) => t.isSpeaker).length}
            </p>
            <p className="text-xs text-muted-foreground">{audienceCount}+ listening</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {tiles.map((t) => (
              <ParticipantTile key={t.id} tile={t} />
            ))}
          </div>

          {/* Raised hand queue (mobile/inline) */}
          <div className="mt-10 rounded-3xl bg-card border border-border p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hand className="h-4 w-4 text-clay" />
                <h3 className="font-display text-base font-semibold text-foreground">Raised hand queue</h3>
              </div>
              <span className="text-xs text-muted-foreground">{raisedHands.length} waiting</span>
            </div>
            <ul className="mt-4 space-y-3">
              {raisedHands.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar user={u} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="soft">Bring up</Button>
                    <Button size="sm" variant="ghost">Skip</Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right panel */}
        <aside className="hidden lg:flex flex-col border-l border-border bg-cream/60">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <MessageSquareQuote className="h-4 w-4 text-clay" />
            <p className="font-display text-base font-semibold">Questions</p>
            <span className="ml-auto text-xs text-muted-foreground">{questions.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {questions.map((q) => {
              const u = getUser(q.userId);
              if (!u) return null;
              return (
                <div key={q.id} className="rounded-2xl bg-card border border-border p-3">
                  <div className="flex items-start gap-2.5">
                    <UserAvatar user={u} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-foreground">{u.name}</p>
                      <p className="text-sm text-foreground/85 mt-0.5">{q.text}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <button className="text-[11px] text-muted-foreground hover:text-clay">↑ {q.upvotes} upvotes</button>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">In queue</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={sendChat} className="p-3 border-t border-border flex gap-2 bg-background/60">
            <Input
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Ask a question…"
              className="bg-card"
            />
            <Button type="submit" variant="hero" size="icon"><Send className="h-4 w-4" /></Button>
          </form>
        </aside>
      </div>

      {/* Controls */}
      <footer className="border-t border-border bg-card/95 backdrop-blur shrink-0">
        <div className="flex items-center justify-center gap-2 md:gap-3 px-3 py-3 md:py-4 overflow-x-auto">
          <ControlBtn active={!muted} onClick={() => setMuted(!muted)} label={muted ? "Unmute" : "Mute"}>
            {muted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </ControlBtn>
          <ControlBtn active={video} onClick={() => setVideo(!video)} label={video ? "Stop video" : "Video"}>
            {video ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </ControlBtn>
          <ControlBtn active={hand} onClick={() => setHand(!hand)} label={hand ? "Lower hand" : "Raise hand"} variant="clay">
            <Hand className="h-4 w-4" />
          </ControlBtn>
          <ControlBtn onClick={() => setQuestionOpen(true)} label="Ask question">
            <MessageSquareQuote className="h-4 w-4" />
          </ControlBtn>
          <ControlBtn onClick={() => setReferralOpen(true)} label="Request referral" variant="hero">
            <Handshake className="h-4 w-4" />
          </ControlBtn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground/70 hover:bg-sand transition-colors"
                aria-label="Moderator tools"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuLabel>Moderator tools</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><MicOff className="h-4 w-4" />Mute participant</DropdownMenuItem>
              <DropdownMenuItem><Volume2 className="h-4 w-4" />Spotlight speaker</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <X className="h-4 w-4" />Remove participant
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild variant="ghost" size="sm" className="ml-1 hidden md:inline-flex">
            <Link to={`/app/rooms/${room.id}`}>Details</Link>
          </Button>
        </div>
      </footer>

      {/* Request referral modal */}
      <Dialog open={referralOpen} onOpenChange={setReferralOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Request a warm intro</DialogTitle>
            <DialogDescription>
              Be specific and kind — hosts get a notification with your message.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitReferral} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Select host</Label>
              <Select defaultValue={tiles[0].user?.id}>
                <SelectTrigger className="bg-cream"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {tiles.filter((t) => t.isSpeaker).map((t) => (
                    <SelectItem key={t.id} value={t.user!.id}>
                      {t.user!.name} — {t.user!.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Request type</Label>
              <Select defaultValue="referral">
                <SelectTrigger className="bg-cream"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="coffee">Coffee chat</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="resume">Resume feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                rows={4}
                placeholder="Hi — really enjoyed your perspective on Canadian corporate hiring. I'm targeting Ops roles and would love a 15-min chat…"
                className="bg-cream resize-none"
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full">Submit request</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ask question modal */}
      <Dialog open={questionOpen} onOpenChange={setQuestionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Ask a question</DialogTitle>
            <DialogDescription>Hosts read every question — keep it specific.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitQuestion} className="space-y-4 mt-2">
            <Textarea
              rows={4}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="What's the difference between an internal referral and an employee submission?"
              className="bg-cream resize-none"
              required
            />
            <Button type="submit" variant="hero" className="w-full">Add to queue</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ParticipantTile = ({ tile }: { tile: Tile }) => {
  const u = tile.user!;
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-card p-4 flex flex-col items-center justify-center text-center transition-all aspect-[4/5]",
        tile.speaking ? "border-clay shadow-[0_0_0_3px_hsl(var(--clay)/0.25)]" : "border-border shadow-soft",
      )}
    >
      {tile.isHost && (
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-clay text-clay-foreground px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider">
          <Crown className="h-2.5 w-2.5" />Host
        </span>
      )}
      {tile.isSpeaker && !tile.isHost && (
        <span className="absolute top-2 left-2 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider">
          Speaker
        </span>
      )}
      <span className="absolute top-2 right-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-background/80 border border-border">
        {tile.muted ? <MicOff className="h-3 w-3 text-muted-foreground" /> : <Mic className="h-3 w-3 text-olive" />}
      </span>

      <div className="relative">
        <UserAvatar user={u} size="xl" />
        {tile.speaking && (
          <span className="absolute inset-0 rounded-full ring-4 ring-clay/40 animate-pulse" aria-hidden />
        )}
        {tile.hasVideo && (
          <span className="absolute -bottom-1 -right-1 inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground border-2 border-card">
            <Video className="h-3 w-3" />
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-medium text-foreground truncate max-w-full">{u.name}</p>
      <p className="text-[11px] text-muted-foreground truncate max-w-full">{u.role}</p>
    </div>
  );
};

interface ControlBtnProps {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: "hero" | "clay" | "default";
}

const ControlBtn = ({ children, label, active, onClick, variant = "default" }: ControlBtnProps) => {
  const styles =
    variant === "hero"
      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft"
      : variant === "clay"
      ? active
        ? "bg-clay text-clay-foreground shadow-soft"
        : "bg-secondary text-foreground/70 hover:bg-sand"
      : active
      ? "bg-primary text-primary-foreground shadow-soft"
      : "bg-secondary text-foreground/70 hover:bg-sand";

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex flex-col items-center justify-center gap-1 rounded-2xl px-3 md:px-4 py-2 transition-colors min-w-[68px]",
        styles,
      )}
    >
      <span className="inline-flex h-6 items-center justify-center">{children}</span>
      <span className="text-[10px] font-medium leading-none">{label}</span>
    </button>
  );
};

export default LiveRoom;
