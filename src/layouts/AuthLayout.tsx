import { Outlet, Link } from "react-router-dom";
import { Logo } from "@/components/hayy/Logo";
import { ArrowLeft } from "lucide-react";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pattern-arabesque opacity-30" />
      <div className="absolute top-20 right-20 h-64 w-64 rounded-full border border-primary/10 opacity-30" />
      <div className="absolute bottom-20 left-20 h-48 w-48 rounded-xl bg-clay/5 rotate-12 opacity-40" />
      <div className="absolute top-1/3 left-10 h-32 w-32 rounded-full border-2 border-dashed border-olive/15 opacity-30" />
      
      <header className="container relative h-18 flex items-center justify-between">
        <Logo size="md" />
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Hayy</span>
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 relative">
        <div className="w-full max-w-5xl flex justify-center">
          <Outlet />
        </div>
      </main>
      
      <footer className="container relative py-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Hayy</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>Where careers come alive</span>
      </footer>
    </div>
  );
};

export default AuthLayout;
