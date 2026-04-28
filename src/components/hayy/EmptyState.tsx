import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-cream/50 p-10 text-center">
      <div className="mx-auto h-12 w-12 rounded-full bg-card flex items-center justify-center text-clay shadow-soft">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-xl text-foreground">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
