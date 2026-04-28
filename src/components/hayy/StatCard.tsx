import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "clay" | "olive";
  className?: string;
}

const tones = {
  default: "bg-card",
  primary: "bg-primary/5",
  clay: "bg-clay/10",
  olive: "bg-olive/10",
};

export const StatCard = ({ label, value, hint, icon: Icon, tone = "default", className }: StatCardProps) => {
  return (
    <div className={cn("rounded-2xl border border-border p-5", tones[tone], className)}>
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-clay" />}
      </div>
      <p className="font-display text-3xl font-semibold text-foreground mt-2">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
};
