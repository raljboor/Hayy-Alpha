import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ eyebrow, title, description, align = "left", action, className }: SectionHeaderProps) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-end gap-4 mb-8", align === "center" && "md:items-center md:flex-col text-center", className)}>
      <div className={cn("flex-1", align === "center" && "max-w-2xl mx-auto")}>
        {eyebrow && <span className="text-xs font-medium uppercase tracking-widest text-clay mb-2 block">{eyebrow}</span>}
        <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-tight">{title}</h2>
        {description && <p className="mt-3 text-muted-foreground max-w-2xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
