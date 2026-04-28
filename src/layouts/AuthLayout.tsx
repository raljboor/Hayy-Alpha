import { Outlet, Link } from "react-router-dom";
import { Logo } from "@/components/hayy/Logo";

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <header className="container h-16 flex items-center">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl flex justify-center">
          <Outlet />
        </div>
      </main>
      <footer className="container py-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">← Back to Hayy</Link>
      </footer>
    </div>
  );
};

export default AuthLayout;
