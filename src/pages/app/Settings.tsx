import { useEffect, useState } from "react";
import { Bell, Lock, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SectionHeader } from "@/components/hayy/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { getProfile, updateProfile } from "@/lib/api/profiles";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAsync } from "@/lib/useAsync";

const Settings = () => {
  const { userId, loading: authLoading } = useCurrentUser();
  const { data: profile, loading: profileLoading } = useAsync(
    () => (userId ? getProfile(userId) : Promise.resolve(null)),
    [userId],
  );

  const loading = authLoading || profileLoading;

  // Local form state — seeded from profile once loaded.
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      await updateProfile(userId, { full_name: name });
      toast.success("Settings saved");
    } catch {
      toast.error("Couldn't save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Your space"
        title="Settings"
        description="Tune notifications, account, and privacy. Everything stays warm — and yours."
      />

      <section className="rounded-3xl bg-card border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Mail className="h-4 w-4 text-clay" />
          <h2 className="font-display text-xl">Account</h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="h-11 rounded-xl bg-cream border-border"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={profile ? "" : ""}
                  placeholder="you@hayy.community"
                  className="h-11 rounded-xl bg-cream border-border"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email changes require re-authentication.
                </p>
              </div>
            </div>
            <Button type="submit" variant="hero" className="mt-5" disabled={saving || !userId}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        )}
      </section>

      <section className="rounded-3xl bg-card border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-4 w-4 text-clay" />
          <h2 className="font-display text-xl">Notifications</h2>
        </div>
        <ul className="divide-y divide-border">
          {[
            { label: "Live room reminders", desc: "Ping me 10 min before a saved room starts.", on: true },
            { label: "Referral updates", desc: "Email me when a host responds.", on: true },
            { label: "Weekly digest", desc: "A warm summary of new rooms and hosts.", on: false },
          ].map((n) => (
            <li key={n.label} className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{n.label}</p>
                <p className="text-sm text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked={n.on} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-card border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="h-4 w-4 text-clay" />
          <h2 className="font-display text-xl">Privacy</h2>
        </div>
        <ul className="divide-y divide-border">
          {[
            { label: "Show my profile to recruiters", desc: "Allow recruiters in rooms to discover you.", on: true },
            { label: "Public referral activity", desc: "Show stats like rooms joined on your profile.", on: false },
          ].map((n) => (
            <li key={n.label} className="py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{n.label}</p>
                <p className="text-sm text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked={n.on} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Trash2 className="h-4 w-4 text-destructive" />
          <h2 className="font-display text-xl text-foreground">Danger zone</h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-md">
          Deleting your account removes your rooms, intros, and follow-ups. This can't be undone.
        </p>
        <Button
          variant="outline"
          className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => toast.error("Account deletion coming soon.")}
        >
          Delete account
        </Button>
      </section>
    </div>
  );
};

export default Settings;
