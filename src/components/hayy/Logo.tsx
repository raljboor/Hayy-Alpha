interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const Logo = ({ className = "", size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };
  
  const textClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <a href="#top" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Geometric Arabic-inspired mark */}
      <span className={`relative flex ${sizeClasses[size]} items-center justify-center`}>
        {/* Outer architectural frame */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-primary to-clay rotate-3 opacity-90 group-hover:rotate-6 transition-transform duration-300" />
        {/* Inner geometric shape */}
        <span className="absolute inset-[3px] rounded-lg bg-gradient-to-br from-clay to-primary shadow-inner" />
        {/* Arabic letter with geometric styling */}
        <span className={`relative font-display ${iconClasses[size]} font-semibold leading-none text-primary-foreground drop-shadow-sm`}>
          ح
        </span>
        {/* Subtle corner accents */}
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-olive/80" />
        <span className="absolute -bottom-0.5 -left-0.5 h-1 w-1 rounded-full bg-clay/60" />
      </span>
      {showText && (
        <span className={`font-display ${textClasses[size]} font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors`}>
          Hayy
        </span>
      )}
    </a>
  );
};

/** Logo mark only - for use in empty states and loading screens */
export const LogoMark = ({ className = "", size = "lg" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
    xl: "h-28 w-28",
  };

  const iconClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-5xl",
  };

  return (
    <div className={`relative flex ${sizeClasses[size]} items-center justify-center ${className}`}>
      {/* Decorative outer rings */}
      <span className="absolute inset-0 rounded-2xl border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
      <span className="absolute inset-2 rounded-xl border border-clay/30" />
      {/* Main geometric mark */}
      <span className="absolute inset-3 rounded-xl bg-gradient-to-br from-primary via-primary to-clay shadow-warm" />
      <span className="absolute inset-4 rounded-lg bg-gradient-to-br from-clay/90 to-primary/90" />
      {/* Arabic letter */}
      <span className={`relative font-display ${iconClasses[size]} font-semibold leading-none text-primary-foreground drop-shadow-md`}>
        ح
      </span>
      {/* Geometric corner accents */}
      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-olive/70" />
      <span className="absolute bottom-1 left-1 h-1.5 w-1.5 rounded-full bg-sand" />
    </div>
  );
};
