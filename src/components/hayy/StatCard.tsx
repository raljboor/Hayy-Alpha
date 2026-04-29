import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  tone?: "default" | "primary" | "clay" | "olive";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const tones = {
  default: "bg-card border-border",
  primary: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20",
  clay: "bg-gradient-to-br from-clay/5 to-clay/10 border-clay/20",
  olive: "bg-gradient-to-br from-olive/5 to-olive/10 border-olive/20",
};

const iconTones = {
  default: "bg-secondary text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  clay: "bg-clay/10 text-clay",
  olive: "bg-olive/10 text-olive",
};

export const StatCard = ({ 
  label, 
  value, 
  hint, 
  icon: Icon, 
  tone = "default", 
  trend,
  className 
}: StatCardProps) => {
  return (
    <div className={cn(
      "group relative rounded-2xl border p-5 transition-all duration-300 hover:shadow-soft overflow-hidden",
      tones[tone],
      className
    )}>
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 pattern-arabesque opacity-20 pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground truncate">
              {label}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {trend && (
              <div className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                trend.isPositive 
                  ? "bg-olive/10 text-olive" 
                  : "bg-destructive/10 text-destructive"
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
              </div>
            )}
            
            {Icon && (
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                iconTones[tone]
              )}>
                <Icon className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        
        <p className="font-display text-3xl sm:text-4xl font-semibold text-foreground mt-3 tracking-tight">
          {value}
        </p>
        
        {hint && (
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{hint}</p>
        )}
      </div>
    </div>
  );
};
