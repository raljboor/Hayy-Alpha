export const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <a href="#top" className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-clay text-clay-foreground shadow-warm">
        <span className="font-display text-xl leading-none -mt-0.5">ح</span>
        <span className="absolute inset-0 rounded-full ring-1 ring-primary/20" />
      </span>
      <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Hayy
      </span>
    </a>
  );
};
