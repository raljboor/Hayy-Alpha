import { Home, Mic, Handshake, User, Bell, Search } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Mic, label: "Rooms" },
  { icon: Handshake, label: "Referrals" },
  { icon: User, label: "Profile" },
];

const stats = [
  { n: "6", label: "Referral requests" },
  { n: "3", label: "Accepted chats" },
  { n: "2", label: "Rooms joined" },
];

export const DashboardPreview = () => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-medium uppercase tracking-widest text-clay mb-3 block">Your home base</span>
          <h2 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-tight">
            A simple home for rooms, referrals, <span className="italic text-primary">and follow-ups.</span>
          </h2>
        </div>

        <div className="rounded-3xl bg-card border border-border shadow-warm overflow-hidden">
          <div className="grid grid-cols-12">
            {/* Sidebar */}
            <aside className="hidden md:flex col-span-3 lg:col-span-2 flex-col bg-cream border-r border-border p-5 gap-1">
              <div className="flex items-center gap-2 mb-6 px-2">
                <span className="h-7 w-7 rounded-full bg-gradient-clay text-clay-foreground flex items-center justify-center font-display text-sm">ح</span>
                <span className="font-display text-lg font-semibold">Hayy</span>
              </div>
              {navItems.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    item.active ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-card"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </aside>

            {/* Main */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <h3 className="font-display text-2xl sm:text-3xl font-medium text-foreground">Good morning, Amira</h3>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"><Search className="h-4 w-4" /></button>
                  <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"><Bell className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-cream p-4 sm:p-5 border border-border">
                    <p className="font-display text-2xl sm:text-3xl font-semibold text-primary">{s.n}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-clay">Suggested room</span>
                  <h4 className="font-display text-lg font-semibold text-foreground mt-2">Amazon Canada Career Room</h4>
                  <p className="text-sm text-muted-foreground mt-1">Operations · Engineering · PM</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex -space-x-1.5">
                      {["bg-clay", "bg-olive", "bg-primary"].map((c, i) => (
                        <div key={i} className={`h-6 w-6 rounded-full ${c} ring-2 ring-card`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">+24 going</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-border p-5 bg-primary/5">
                  <span className="text-xs font-medium uppercase tracking-wider text-clay">Pending request</span>
                  <h4 className="font-display text-lg font-semibold text-foreground mt-2">Coffee chat request</h4>
                  <p className="text-sm text-muted-foreground mt-1">Waiting for host response</p>
                  <div className="flex items-center gap-2 mt-4">
                    <span className="h-2 w-2 rounded-full bg-clay animate-pulse" />
                    <span className="text-xs text-muted-foreground">Sent 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
