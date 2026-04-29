import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { LogoMark } from "./Logo";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  variant?: "default" | "branded";
}

export const EmptyState = ({ icon: Icon, title, description, action, variant = "default" }: EmptyStateProps) => {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-gradient-to-b from-cream/80 to-cream/40 p-10 sm:p-12 text-center relative overflow-hidden">
      {/* Subtle geometric background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      
      <div className="relative">
        {variant === "branded" ? (
          <div className="mx-auto w-fit">
            <LogoMark size="md" />
          </div>
        ) : Icon ? (
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-card to-cream flex items-center justify-center text-clay shadow-soft border border-border/50">
            <Icon className="h-6 w-6" />
          </div>
        ) : (
          <div className="mx-auto w-fit">
            <LogoMark size="sm" />
          </div>
        )}
        <h3 className="mt-5 font-display text-xl sm:text-2xl text-foreground text-balance">{title}</h3>
        {description && (
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed text-balance">
            {description}
          </p>
        )}
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
};
