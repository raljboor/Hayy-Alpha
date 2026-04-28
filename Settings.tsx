import { Bell, Lock, Mail, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/hayy/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow="Your space"
        title="Settings"
        description="Tune notifications, account, and privacy. Everything stays warm — and yours."
      />

      <section className="rounded-3xl bg-card border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5"><Mail className="h-4 w-4 text-clay" /><h2 className="font-display text-xl">Account</h2></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" defaultValue="Amira Khan" className="h-11 rounded-xl bg-cream border-border" /></div>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="amira@hayy.community" className="h-11 rounded-xl bg-cream border-border" /></div>
        </div>
        <Button variant="hero" className="mt-5">Save changes</Button>
      </section>

      <section className="rounded-3xl bg-card border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5"><Bell className="h-4 w-4 text-clay" /><h2 className="font-display text-xl">Notifications</h2></div>
        <ul className="divide-y divide-border">
          {[
            { label: "Live room reminders", desc: "Ping me 10 min before a saved room starts.", on: true },
            { label: "Referral updates", desc: "Email me when a host responds.", on: true },
            { label: "Weekly digest", desc: "A warm summary of new rooms and hosts.", on: false },
          ].map((n) => (
            <li key={n.label} className="py-4 flex items-center justify-between gap-4">
              <div><p className="font-medium text-foreground">{n.label}</p><p className="text-sm text-muted-foreground">{n.desc}</p></div>
              <Switch defaultChecked={n.on} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-card border border-border p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-5"><Lock className="h-4 w-4 text-clay" /><h2 className="font-display text-xl">Privacy</h2></div>
        <ul className="divide-y divide-border">
          {[
            { label: "Show my profile to recruiters", desc: "Allow recruiters in rooms to discover you.", on: true },
            { label: "Public referral activity", desc: "Show stats like rooms joined on your profile.", on: false },
          ].map((n) => (
            <li key={n.label} className="py-4 flex items-center justify-between gap-4">
              <div><p className="font-medium text-foreground">{n.label}</p><p className="text-sm text-muted-foreground">{n.desc}</p></div>
              <Switch defaultChecked={n.on} />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-3"><Trash2 className="h-4 w-4 text-destructive" /><h2 className="font-display text-xl text-foreground">Danger zone</h2></div>
        <p className="text-sm text-muted-foreground max-w-md">Deleting your account removes your rooms, intros, and follow-ups. This can't be undone.</p>
        <Button variant="outline" className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">Delete account</Button>
      </section>
    </div>
  );
};

export default Settings;
