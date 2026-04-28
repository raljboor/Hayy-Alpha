import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorState = ({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) => (
  <div className="rounded-3xl border border-dashed border-destructive/40 bg-destructive/5 p-8 text-center">
    <div className="mx-auto h-12 w-12 rounded-full bg-card flex items-center justify-center text-destructive shadow-soft">
      <AlertTriangle className="h-5 w-5" />
    </div>
    <h3 className="mt-4 font-display text-xl text-foreground">{title}</h3>
    {description && (
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
    )}
    {onRetry && (
      <Button variant="soft" size="sm" className="mt-5" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

export default ErrorState;
